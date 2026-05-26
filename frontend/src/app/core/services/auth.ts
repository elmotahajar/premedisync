import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';

  inscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError((error) => throwError(() => this.normaliserErreur(error)))
    );
  }

  register(data: any): Observable<any> {
    return this.inscription(data);
  }

  connexion(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password: motDePasse
    }).pipe(
      tap((response: any) => {
        this.sauvegarderToken(response.token, response.user?.role);
      }),
      catchError((error) => throwError(() => this.normaliserErreur(error)))
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.connexion(credentials.email, credentials.password).pipe(
      tap(() => {
        const role = this.getRole();
        if (role) {
          this.redirigerSelonRole(role);
        }
      })
    );
  }

  sauvegarderToken(token: string, role?: string) {
    localStorage.setItem('token', token);
    const r = role || this.extraireRole(token);
    localStorage.setItem('role', r);
  }

  extraireRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'patient';
    } catch {
      return 'patient';
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getPatientId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  }

  getPrenom(): string {
    const token = this.getToken();
    if (!token) return 'Patient';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.prenom || 'Patient';
    } catch {
      return 'Patient';
    }
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  estConnecte(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.estConnecte();
  }

  deconnexion() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  logout() {
    this.deconnexion();
  }

  redirigerSelonRole(role: string) {
    switch (role) {
      case 'secretaire':
        this.router.navigate(['/secretaire/dashboard']);
        break;
      case 'medecin':
        this.router.navigate(['/medecin/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/patient/dashboard']);
        break;
    }
  }

  private normaliserErreur(error: any): Error {
    const message = error?.error?.message || error?.message || 'Une erreur est survenue';
    return new Error(message);
  }
}