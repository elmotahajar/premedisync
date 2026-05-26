import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultations.html',
  styleUrls: ['./consultations.css']
})
export class Consultations implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  historique = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  consultationSelectionnee: any = null;

  ngOnInit(): void {
    this.loadHistorique();
  }

  loadHistorique(): void {
    this.loading.set(true);
    this.error.set(null);
    this.patientService.getHistorique().subscribe({
      next: (data) => {
        this.historique.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement historique:', err);
        this.error.set('Impossible de charger votre historique de consultations.');
        this.loading.set(false);
      }
    });
  }

  voirDetails(consultation: any): void {
    this.consultationSelectionnee =
      this.consultationSelectionnee === consultation ? null : consultation;
  }

  getMois(dateString: string): string {
    const mois = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
    const d = new Date(dateString);
    return mois[d.getMonth()] ?? '';
  }

  getJour(dateString: string): string {
    return new Date(dateString).getDate().toString().padStart(2, '0');
  }

  retour(): void {
    this.router.navigate(['/patient/accueil']);
  }
}