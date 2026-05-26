import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-medecin-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="patients-container">
      <div class="header-actions" style="margin-bottom: 24px;">
        <h2 style="margin: 0;">Mes Patients</h2>
        <p style="color: var(--text-muted); margin: 4px 0 0 0;">Liste des patients suivis</p>
      </div>

      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Date de naissance</th>
              <th>Téléphone</th>
              <th>Adresse email</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of patients(); track p.id) {
              <tr>
                <td style="font-weight: 600;">{{ p.prenom || p.firstName }} {{ p.nom || p.lastName }}</td>
                <td>{{ p.dateNaissance || p.dateOfBirth || 'N/A' }}</td>
                <td>{{ p.telephone || p.phone || 'N/A' }}</td>
                <td>{{ p.email || 'N/A' }}</td>
                <td style="text-align: right;">
                  <button (click)="consulter(p.id)" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">
                    Dossier & CR
                  </button>
                </td>
              </tr>
            }
            @if (patients().length === 0) {
              <tr>
                <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
                  {{ chargement() ? '⏳ Chargement...' : 'Aucun patient trouvé.' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MedecinPatientsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  patients = signal<any[]>([]);
  chargement = signal(false);
  private apiUrl = 'http://localhost:3000/api';

  ngOnInit() {
    this.chargerPatients();
  }

  /**
   * Charge les patients du médecin via API
   */
  chargerPatients() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let medecinId: string | null = null;

    // Extraire l'ID du médecin depuis le JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      medecinId = payload.id || payload.userId;
    } catch (e) {
      console.error('Erreur décodage token:', e);
    }

    if (!medecinId) return;

    this.chargement.set(true);

    this.http.get(`${this.apiUrl}/patients/medecin/${medecinId}`, { headers }).subscribe({
      next: (data: any) => {
        this.patients.set(Array.isArray(data) ? data : data?.patients || []);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement patients:', err);
        this.chargement.set(false);
      }
    });
  }

  consulter(id: number) {
    this.router.navigate([`/medecin/consultation/${id}`]);
  }
}
