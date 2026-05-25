import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface RendezVousType {
  id: number;
  patient: string;
  medecin: string;
  date: string;
  heure: string;
  statut: 'confirmé' | 'en attente' | 'annulé';
}

@Component({
  selector: 'app-rendez-vous',
  imports: [RouterLink, FormsModule],
  templateUrl: './gestion-rdv.html',
  styleUrl: './gestion-rdv.css',
})
export class RendezVous {
  rdvs = signal<RendezVousType[]>([
    { id: 1, patient: 'Ahmed Benali', medecin: 'Dr. Alaoui', date: '2026-05-22', heure: '10:00', statut: 'confirmé' },
    { id: 2, patient: 'Fatima Zahra', medecin: 'Dr. Idrissi', date: '2026-05-22', heure: '11:30', statut: 'en attente' },
  ]);

  nouveauRdv = { id: 0, patient: '', medecin: '', date: '', heure: '' };
  afficherFormulaire = signal(false);
  modeEdition = signal(false);
  messageSucces = signal('');

  ajouterOuModifierRdv(): void {
    if (this.nouveauRdv.patient && this.nouveauRdv.date && this.nouveauRdv.heure) {
      if (this.modeEdition()) {
        // Mode Modification
        this.rdvs.update(liste =>
          liste.map(r => r.id === this.nouveauRdv.id ? { ...r, patient: this.nouveauRdv.patient, medecin: this.nouveauRdv.medecin, date: this.nouveauRdv.date, heure: this.nouveauRdv.heure } : r)
        );
        this.messageSucces.set('✅ Rendez-vous modifié avec succès !');
      } else {
        // Mode Ajout
        const rdv: RendezVousType = {
          id: Date.now(),
          patient: this.nouveauRdv.patient,
          medecin: this.nouveauRdv.medecin,
          date: this.nouveauRdv.date,
          heure: this.nouveauRdv.heure,
          statut: 'en attente'
        };
        this.rdvs.update(liste => [...liste, rdv]);
        this.messageSucces.set('✅ Rendez-vous programmé avec succès !');
      }

      this.reinitialiserFormulaire();
      setTimeout(() => this.messageSucces.set(''), 3000);
    }
  }

  chargerRdvPourEdition(rdv: RendezVousType): void {
    this.nouveauRdv = { ...rdv };
    this.modeEdition.set(true);
    this.afficherFormulaire.set(true);
  }

  confirmerRdv(id: number): void {
    this.rdvs.update(liste =>
      liste.map(r => r.id === id ? { ...r, statut: 'confirmé' as const } : r)
    );
  }

  annulerRdv(id: number): void {
    this.rdvs.update(liste =>
      liste.map(r => r.id === id ? { ...r, statut: 'annulé' as const } : r)
    );
  }

  reinitialiserFormulaire(): void {
    this.nouveauRdv = { id: 0, patient: '', medecin: '', date: '', heure: '' };
    this.modeEdition.set(false);
    this.afficherFormulaire.set(false);
  }
}