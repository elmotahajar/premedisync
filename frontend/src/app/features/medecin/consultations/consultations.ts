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
                <td style="font-weight: 600;">{{ c.patientNom || 'Patient' }}</td>
                <td>{{ c.dateHeure | date: 'dd/MM/yyyy à HH:mm' }}</td>
                <td>{{ c.motif || 'Consultation de suivi' }}</td>
                <td>
                  <span class="admin-badge" [class.success]="c.statut === 'Confirmé'" [class.warning]="c.statut === 'En attente'">
                    {{ c.statut || 'Confirmé' }}
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
                  Aucune consultation enregistrée.
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

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get('http://localhost:3000/api/medecin/patients-jour', { headers }).subscribe({
      next: (data: any) => {
        this.consultations.set(Array.isArray(data) ? data : []);
      },
      error: () => {
        this.consultations.set([
          { id: 1, patientNom: 'Jean Dupont', dateHeure: '2026-05-25T14:30:00', motif: 'Suivi grippe', statut: 'Confirmé' },
          { id: 2, patientNom: 'Marie Lefebvre', dateHeure: '2026-05-25T15:00:00', motif: 'Tension', statut: 'Confirmé' }
        ]);
      }
    });
  }

  voirDetails(id: number) {
    this.router.navigate([`/medecin/consultation/${id}`]);
  }
}
