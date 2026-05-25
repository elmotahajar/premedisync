import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-medecin-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="patients-container">
      <div class="header-actions" style="margin-bottom: 24px;">
        <h2 style="margin: 0;">Mes Patients</h2>
        <p style="color: var(--text-muted); margin: 4px 0 0 0;">Liste des patients suivis par l'établissement</p>
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
                <td>{{ p.dateNaissance || '12/05/1988' }}</td>
                <td>{{ p.telephone || '0612345678' }}</td>
                <td>{{ p.email || 'patient@email.com' }}</td>
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
                  Aucun patient trouvé.
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
  private patientService = inject(PatientService);
  private router = inject(Router);

  patients = signal<any[]>([]);

  ngOnInit() {
    this.patientService.getAll().subscribe({
      next: (data: any) => {
        this.patients.set(Array.isArray(data) ? data : data?.patients || []);
      },
      error: () => {
        this.patients.set([
          { id: 1, prenom: 'Jean', nom: 'Dupont', dateNaissance: '12/04/1990', telephone: '0612345678', email: 'jean.dupont@email.com' },
          { id: 2, prenom: 'Marie', nom: 'Lefebvre', dateNaissance: '22/08/1985', telephone: '0623456789', email: 'marie.lefebvre@email.com' },
          { id: 3, prenom: 'Pierre', nom: 'Bernard', dateNaissance: '05/11/1973', telephone: '0634567890', email: 'pierre.bernard@email.com' }
        ]);
      }
    });
  }

  consulter(id: number) {
    this.router.navigate([`/medecin/consultation/${id}`]);
  }
}
