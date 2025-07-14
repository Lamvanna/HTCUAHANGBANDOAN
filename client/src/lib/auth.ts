import { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.authState = {
          user,
          token,
          isAuthenticated: true,
        };
      } catch (error) {
        this.clearStorage();
      }
    }
  }

  private saveToStorage(user: AuthUser, token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng nhập thất bại');
    }

    const data = await response.json();
    
    this.authState = {
      user: data.user,
      token: data.token,
      isAuthenticated: true,
    };

    this.saveToStorage(data.user, data.token);
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    confirmPassword: string;
  }): Promise<void> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng ký thất bại');
    }

    const data = await response.json();
    
    this.authState = {
      user: data.user,
      token: data.token,
      isAuthenticated: true,
    };

    this.saveToStorage(data.user, data.token);
  }

  logout(): void {
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    this.clearStorage();
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getToken(): string | null {
    return this.authState.token;
  }

  getUser(): AuthUser | null {
    return this.authState.user;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  hasRole(role: string): boolean {
    return this.authState.user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authState.user ? roles.includes(this.authState.user.role) : false;
  }
}

export const authService = AuthService.getInstance();
