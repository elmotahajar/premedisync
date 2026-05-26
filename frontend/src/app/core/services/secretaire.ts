import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SecretaireService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/secretaire';
  private rdvApiUrl = 'http://localhost:3000/api/rendez-vous';

  // Patients
  creerPatient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patients`, data);
  }

  listerPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  listerMedecins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medecins`);
  }

  // Rendez-vous
  creerRendezVous(data: any): Observable<any> {
    return this.http.post(`${this.rdvApiUrl}`, data);
  }

  listerRendezVous(): Observable<any[]> {
    return this.http.get<any[]>(`${this.rdvApiUrl}`);
  }

  modifierRendezVous(id: number, data: any): Observable<any> {
    return this.http.put(`${this.rdvApiUrl}/${id}`, data);
  }

  annulerRendezVous(id: number): Observable<any> {
    return this.http.delete(`${this.rdvApiUrl}/${id}`);
  }

  // Feuilles de soins
  creerFeuilleSoins(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/feuilles-soins`, data);
  }

  listerFeuillesSoins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/feuilles-soins`);
  }

  validerFeuilleSoins(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/feuilles-soins/${id}/valider`, {});
  }

  // Factures
  emettreFacture(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/factures`, data);
  }

  listerFactures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/factures`);
  }

  enregistrerPaiement(id: number, montantPaye: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/factures/${id}/payer`, { montantPaye });
  }

  getFacturePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/factures/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}