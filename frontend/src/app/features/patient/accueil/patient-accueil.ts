import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { RdvService } from '../../../core/services/rdv.service';
import { AuthService } from '../../../core/services/auth';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-accueil.html',
  styleUrls: ['./patient-accueil.css']
})
export class PatientAccueilComponent implements OnInit {
  private patientService = inject(PatientService);
  private rdvService = inject(RdvService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);
  error = signal<string | null>(null);
  patient = signal<any>({});
  
  // KPI Cards
  prochainRdv = signal<any>(null);
  totalConsultations = signal<number>(0);
  ordonnancesActives = signal<number>(0);
  derniereEvaluation = signal<string>('5/5');

  // Recent Activity
  recentRdv = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    const patientId = this.authService.getPatientId();
    const prenom = this.authService.getPrenom();
    
    this.patient.set({ prenom });

    if (!patientId) {
      this.error.set('Session expirée. Veuillez vous reconnecter.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      upcomingRdv: this.rdvService.getPatientRendezVous(patientId, true),
      allRdv: this.rdvService.getPatientRendezVous(patientId, false),
      historique: this.patientService.getHistorique(),
      ordonnances: this.patientService.getOrdonnances(),
      feedbacks: this.patientService.getAvis()
    }).subscribe({
      next: (res: any) => {
        this.patient.set({ prenom: prenom || 'Patient' });

        const upcomingList = Array.isArray(res.upcomingRdv) ? res.upcomingRdv : [];
        this.prochainRdv.set(upcomingList[0] || null);

        this.totalConsultations.set(Array.isArray(res.historique) ? res.historique.length : 0);
        this.ordonnancesActives.set(
          (Array.isArray(res.ordonnances)
            ? res.ordonnances.filter((o: any) => o.statut === 'Active' || o.statut === 'Valide' || !o.statut).length
            : 0)
        );

        const avisList = Array.isArray(res.feedbacks) ? res.feedbacks : [];
        if (avisList.length > 0) {
          this.derniereEvaluation.set(`${avisList[0].note}/5 ★`);
        } else {
          this.derniereEvaluation.set('Aucun avis');
        }

        const rdvs = Array.isArray(res.allRdv) ? res.allRdv : [];
        this.recentRdv.set(
          [...rdvs].sort((left, right) => new Date(right.dateHeure).getTime() - new Date(left.dateHeure).getTime()).slice(0, 5)
        );

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement donnees accueil patient:', err);
        this.error.set('Impossible de charger les données réelles.');
        this.loading.set(false);
      }
    });
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'confirmé' || s === 'confirme' || s === 'confirmed' || s === 'success') {
      return '#10b981';
    }
    if (s === 'en attente' || s === 'pending' || s === 'warning') {
      return '#f59e0b';
    }
    if (s === 'annulé' || s === 'annule' || s === 'cancelled' || s === 'danger') {
      return '#ef4444';
    }
    return '#0ea5e9';
  }
}
