import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-medecin-consultations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="consultations-container">
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0;">Consultations récentes</h2>
        <p style="color: var(--text-muted); margin: 4px 0 0 0;">Historique des rendez-vous et comptes rendus rédigés</p>
      </div>

      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date & Heure</th>
              <th>Motif</th>
              <th>Statut</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (c of consultations(); track c.id) {
              <tr>
                <td style="font-weight: 600;">{{ c.patientNom || c.patientName || 'Patient' }}</td>
                <td>{{ c.dateHeure | date: 'dd/MM/yyyy à HH:mm' }}</td>
                <td>{{ c.motif || c.reason || 'Consultation de suivi' }}</td>
                <td>
                  <span class="admin-badge" [class.success]="c.statut === 'Confirmé'" [class.warning]="c.statut === 'En attente'">
                    {{ c.statut || c.status || 'Confirmé' }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button (click)="voirDetails(c.id)" class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;">
                    Modifier CR
                  </button>
                </td>
              </tr>
            }
            @if (consultations().length === 0) {
              <tr>
                <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
                  {{ chargement() ? '⏳ Chargement...' : 'Aucune consultation enregistrée.' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MedecinConsultationsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  consultations = signal<any[]>([]);
  chargement = signal(false);
  private apiUrl = 'http://localhost:3000/api';

  ngOnInit() {
    this.chargerConsultations();
  }

  /**
   * Charge les consultations du médecin via API
   */
  chargerConsultations() {
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

    this.http.get(`${this.apiUrl}/consultations/medecin/${medecinId}`, { headers }).subscribe({
      next: (data: any) => {
        this.consultations.set(Array.isArray(data) ? data : data?.consultations || []);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.chargement.set(false);
      }
    });
  }

  voirDetails(id: number) {
    this.router.navigate([`/medecin/consultation/${id}`]);
  }
}
