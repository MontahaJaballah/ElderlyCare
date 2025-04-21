export interface User {
  _id?: string;
  name: string;
  email: string;
  age?: number;
  createdAt?: Date;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token?: string;
}
