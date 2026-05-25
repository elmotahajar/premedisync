import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RdvService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/rendez-vous';

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(rdvData: any): Observable<any> {
    return this.http.post(this.apiUrl, rdvData);
  }

  update(id: number, rdvData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, rdvData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDisponibilites(medecinId: number, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/disponibilites?medecinId=${medecinId}&date=${date}`);
  }
}