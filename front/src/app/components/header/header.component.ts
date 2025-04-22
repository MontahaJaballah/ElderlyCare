import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userType: string | null = null;
  userName: string | null = null;
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.userType = localStorage.getItem('userType');
    
    // Get user name from local storage if available
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userName = user.prenom ? `${user.prenom} ${user.nom}` : 'User';
      } catch (e) {
        this.userName = 'User';
      }
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userType = null;
    this.userName = null;
    this.router.navigate(['/login']);
  }
}
