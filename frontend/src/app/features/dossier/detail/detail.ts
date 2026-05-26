import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  loading = signal(true);
  error = signal<string | null>(null);
  consultation = signal<any | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadConsultation(id);
  }

  loadConsultation(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      historique: this.patientService.getHistorique(),
      ordonnances: this.patientService.getOrdonnances()
    }).subscribe({
      next: (response: any) => {
        const historique = Array.isArray(response.historique) ? response.historique : [];
        const consultation = historique.find((item: any) => item.id === id);

        if (!consultation) {
          this.error.set('Consultation introuvable.');
          this.consultation.set(null);
          this.loading.set(false);
          return;
        }

        const prescriptions = Array.isArray(response.ordonnances) ? response.ordonnances : [];

        this.consultation.set({
          ...consultation,
          diagnostic: consultation.diagnostic || 'Non disponible dans le dossier patient',
          compteRendu: consultation.compteRendu || 'Aucun compte-rendu détaillé disponible.',
          medicaments: prescriptions
            .filter((item: any) => item.date && consultation.date && String(item.date).startsWith(String(consultation.date)))
            .reduce((accumulator: string[], item: any) => {
              const items = String(item.medicaments || '')
                .split(',')
                .map((medicament) => medicament.trim())
                .filter(Boolean);
              return [...accumulator, ...items];
            }, [])
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement détail consultation:', err);
        this.error.set('Impossible de charger le détail de la consultation.');
        this.loading.set(false);
      }
    });
  }
}