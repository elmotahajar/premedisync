import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/patient';

  getDossier(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dossier`);
  }

  getOrdonnances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ordonnances`);
  }

  getHistorique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historique`);
  }

  uploadDocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('document', file);
    return this.http.post(`${this.apiUrl}/documents`, formData);
  }

  getProfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profil`);
  }

  updateProfil(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profil`, data);
  }
}