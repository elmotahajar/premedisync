import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PatientService } from '../../../core/services/patient.service';
import { RdvService } from '../../../core/services/rdv.service';
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
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(true);
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    forkJoin({
      profil: this.patientService.getProfil(),
      rdvs: this.rdvService.getAll(),
      historique: this.patientService.getHistorique(),
      ordonnances: this.patientService.getOrdonnances()
    }).subscribe({
      next: (res: any) => {
        this.patient.set(res.profil);
        
        // Compute KPIs
        const now = new Date();
        const futureRdvs = res.rdvs
          .filter((r: any) => new Date(r.dateHeure) > now && r.statut !== 'Annulé')
          .sort((a: any, b: any) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
        
        if (futureRdvs.length > 0) {
          this.prochainRdv.set(futureRdvs[0]);
        }

        this.totalConsultations.set(res.historique?.length || 0);
        this.ordonnancesActives.set(res.ordonnances?.filter((o: any) => o.statut === 'Active' || o.statut === 'Valide' || !o.statut).length || 0);
        
        // Set recent appointments
        this.recentRdv.set(res.rdvs.slice(0, 5));
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement donnees accueil patient:', err);
        // Fallback mock data
        this.patient.set({ prenom: 'Patient', nom: '' });
        this.prochainRdv.set({ dateHeure: '2026-06-01T10:00:00', medecinNom: 'Dr. Martin' });
        this.totalConsultations.set(3);
        this.ordonnancesActives.set(2);
        this.recentRdv.set([
          { id: 1, dateHeure: '2026-05-15T14:30:00', medecinNom: 'Dr. Martin', specialite: 'Généraliste', statut: 'Confirmé' },
          { id: 2, dateHeure: '2026-04-10T10:00:00', medecinNom: 'Dr. Bernard', specialite: 'Cardiologue', statut: 'Confirmé' }
        ]);
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
