import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private base = 'http://localhost:3000/api';

  private get patientId(): number | null {
    return this.authService.getPatientId();
  }

  private adminApiUrl = 'http://localhost:3000/api/patients';
  // ─── Dossier ───────────────────────────────────────────────
  getDossier(): Observable<any> {
    return this.http.get(`${this.base}/dossier/patient/${this.patientId}`);
  }

  getHistorique(): Observable<any> {
    return this.http.get(`${this.base}/patient/historique`);
  }

  uploadDocument(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('document', file);
    return this.http.post(`${this.base}/dossier/patient/${this.patientId}/documents`, formData);
  }

  getMedecins(): Observable<any> {
    return this.http.get(`${this.base}/patient/medecins`);
  }

  // ─── Admin CRUD (existing screens) ────────────────────────
  getAll(filters?: any, page?: number): Observable<any> {
    return this.http.get(this.adminApiUrl, { params: { ...filters, page: page ?? 1 } as any });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.adminApiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.adminApiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.adminApiUrl}/${id}`);
  }

  // ─── Ordonnances ───────────────────────────────────────────
  getOrdonnances(): Observable<any> {
    return this.http.get(`${this.base}/prescriptions/patient/${this.patientId}`);
  }

  // ─── Avis ──────────────────────────────────────────────────
  getAvis(): Observable<any> {
    return this.http.get(`${this.base}/avis/patient/${this.patientId}`);
  }

  postAvis(payload: { note: number; commentaire: string }): Observable<any> {
    return this.http.post(`${this.base}/avis`, payload);
  }

  postSignalement(payload: { type: string; description: string; urgence: string }): Observable<any> {
    return this.http.post(`${this.base}/signalements`, payload);
  }

  // ─── Paramètres ────────────────────────────────────────────
  getProfil(): Observable<any> {
    return this.http.get(`${this.base}/patients/${this.patientId}`);
  }

  updateProfil(data: any): Observable<any> {
    return this.http.put(`${this.base}/patients/${this.patientId}`, data);
  }
}