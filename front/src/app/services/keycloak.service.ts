import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloakAuth: any;
  private initialized = false;
  private userProfile: any = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private roles: string[] = [];

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}
  
  /**
   * Check if Keycloak has been initialized
   * @returns true if Keycloak has been initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.initialized) {
        resolve(true);
        return;
      }

      const keycloakConfig = {
        url: 'http://localhost:8080/',
        realm: 'ElderlyCareKeycloak',
        clientId: 'elderly-care-frontend'
      };

      this.keycloakAuth = new Keycloak(keycloakConfig);

      this.keycloakAuth.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html' })
        .then((authenticated: boolean) => {
          this.initialized = true;
          this.isAuthenticatedSubject.next(authenticated);

          if (authenticated) {
            this.token = this.keycloakAuth.token;
            this.refreshToken = this.keycloakAuth.refreshToken;
            this.roles = this.keycloakAuth.realmAccess?.roles || [];
            
            // Store tokens in localStorage for your existing auth service to use
            if (this.token) localStorage.setItem('token', this.token);
            if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
            
            // Set up token refresh
            this.setupTokenRefresh();
            
            // Load user profile
            this.keycloakAuth.loadUserProfile()
              .then((profile: any) => {
                this.userProfile = profile;
                // Store user info in a format compatible with your existing auth service
                localStorage.setItem('currentUser', JSON.stringify({
                  id: profile.id,
                  email: profile.email,
                  prenom: profile.firstName,
                  nom: profile.lastName,
                  userType: this.hasRole('equip_admin') ? 'PROFESSIONNEL_SANTE' : 'PERSONNE_AGEE'
                }));
              })
              .catch((err: any) => console.error('Failed to load user profile', err));
          }

          resolve(authenticated);
        })
        .catch((error: any) => {
          console.error('Keycloak init failed', error);
          reject(error);
        });
    });
  }

  login(): Promise<void> {
    if (!this.keycloakAuth) {
      return Promise.reject(new Error('Keycloak not initialized'));
    }
    
    return this.keycloakAuth.login();
  }
  
  /**
   * Update/refresh the token if it's expired
   * @param minValidity Minimum validity time in seconds (default 30)
   * @returns Promise that resolves when the token is refreshed
   */
  updateToken(minValidity = 30): Promise<boolean> {
    if (!this.keycloakAuth) {
      return Promise.reject(new Error('Keycloak not initialized'));
    }
    
    return this.keycloakAuth.updateToken(minValidity);
  }

  logout(): Promise<void> {
    return this.keycloakAuth.logout()
      .then(() => {
        this.token = null;
        this.refreshToken = null;
        this.userProfile = null;
        this.roles = [];
        this.isAuthenticatedSubject.next(false);
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
      });
  }

  getToken(): string | null {
    return this.token ?? localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getUsername(): string {
    return this.userProfile?.username || '';
  }

  getUserProfile(): any {
    return this.userProfile;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  private setupTokenRefresh(): void {
    if (this.keycloakAuth.token) {
      // Check token validity every 10 seconds
      const tokenCheckInterval = setInterval(() => {
        this.keycloakAuth.updateToken(30)
          .then((refreshed: boolean) => {
            if (refreshed) {
              this.token = this.keycloakAuth.token;
              this.refreshToken = this.keycloakAuth.refreshToken;
              
              // Update tokens in localStorage
              if (this.token) localStorage.setItem('token', this.token);
              if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
              
              console.log('Token refreshed');
            }
          })
          .catch(() => {
            console.error('Failed to refresh token');
            clearInterval(tokenCheckInterval);
            this.logout();
          });
      }, 10000);
    }
  }
}
