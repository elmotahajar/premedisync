import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin';

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getUtilisateurs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/utilisateurs`);
  }

  createUtilisateur(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilisateurs`, data);
  }

  updateUtilisateur(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/utilisateurs/${id}`, data);
  }

  deleteUtilisateur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/utilisateurs/${id}`);
  }
}