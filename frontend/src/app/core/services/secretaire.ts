import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SecretaireService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/secretaire';

  // Patients
  creerPatient(data: any) {
    return this.http.post(`${this.apiUrl}/patients`, data);
  }

  listerPatients() {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  // Factures
  emettreFacture(data: any) {
    return this.http.post(`${this.apiUrl}/factures`, data);
  }

  getFacturePDF(id: number) {
    return this.http.get(`${this.apiUrl}/factures/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}