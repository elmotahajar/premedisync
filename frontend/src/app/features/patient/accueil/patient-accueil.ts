import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
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
      upcomingRdv: this.http.get<any[]>(`http://localhost:3000/api/rendezvous/patient/${patientId}?upcoming=1`),
      allRdv: this.rdvService.getAll(),
      historique: this.patientService.getHistorique(),
      ordonnances: this.patientService.getOrdonnances(),
      feedbacks: this.http.get<any[]>(`http://localhost:3000/api/avis`)
    }).subscribe({
      next: (res: any) => {
        // Set profile prenom dynamically
        this.patient.set({ prenom: prenom || 'Patient' });

        // Set next appointment from dedicated endpoint
        if (res.upcomingRdv && res.upcomingRdv.length > 0) {
          this.prochainRdv.set(res.upcomingRdv[0]);
        } else {
          this.prochainRdv.set(null);
        }

        // Set counters
        this.totalConsultations.set(res.historique?.length || 0);
        this.ordonnancesActives.set(
          res.ordonnances?.filter((o: any) => o.statut === 'Active' || o.statut === 'Valide' || !o.statut).length || 0
        );

        // Find last review from this patient
        const myAvis = res.feedbacks?.filter((f: any) => f.patientId === patientId);
        if (myAvis && myAvis.length > 0) {
          this.derniereEvaluation.set(`${myAvis[0].note}/5 ★`);
        } else {
          this.derniereEvaluation.set('Aucun avis');
        }

        // Set recent appointments (limit 5)
        const rdvs = Array.isArray(res.allRdv) ? res.allRdv : (res.allRdv?.rendezVous || []);
        this.recentRdv.set(rdvs.slice(0, 5));

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
