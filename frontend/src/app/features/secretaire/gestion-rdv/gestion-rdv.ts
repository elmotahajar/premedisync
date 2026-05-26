import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretaireService } from '../../../core/services/secretaire';

interface RendezVousType {
  id: number;
  patientId: number;
  patient: string;
  medecinId: number;
  medecin: string;
  motif: string;
  date: string;
  heure: string;
  statut: 'confirmé' | 'en attente' | 'annulé';
}

interface PersonOption {
  id: number;
  nom: string;
  prenom: string;
}

@Component({
  selector: 'app-rendez-vous',
  imports: [RouterLink, FormsModule],
  templateUrl: './gestion-rdv.html',
  styleUrl: './gestion-rdv.css',
})
export class RendezVous implements OnInit {
  private secretaireService = inject(SecretaireService);

  rdvs = signal<RendezVousType[]>([]);
  patients = signal<PersonOption[]>([]);
  medecins = signal<PersonOption[]>([]);

  nouveauRdv = {
    id: 0,
    patientId: 0,
    medecinId: 0,
    motif: '',
    date: '',
    heure: ''
  };
  afficherFormulaire = signal(false);
  modeEdition = signal(false);
  messageSucces = signal('');
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargerPatients();
    this.chargerMedecins();
    this.chargerRendezVous();
  }

  chargerPatients(): void {
    this.secretaireService.listerPatients().subscribe({
      next: (data) => this.patients.set(data),
      error: () => this.messageErreur.set('Erreur lors du chargement des patients')
    });
  }

  chargerMedecins(): void {
    this.secretaireService.listerMedecins().subscribe({
      next: (data) => this.medecins.set(data),
      error: () => this.messageErreur.set('Erreur lors du chargement des médecins')
    });
  }

  chargerRendezVous(): void {
    this.secretaireService.listerRendezVous().subscribe({
      next: (data: any[]) => {
        const formatted = (data || []).map((rdv: any) => ({
          id: rdv.id,
          patientId: Number(rdv.patientId),
          patient: rdv.patientNom || `Patient #${rdv.patientId}`,
          medecinId: Number(rdv.medecinId),
          medecin: rdv.medecinNom || `Médecin #${rdv.medecinId}`,
          motif: rdv.motif || '',
          date: rdv.date || '',
          heure: rdv.heure || '',
          statut: (rdv.statut || 'en attente') as 'confirmé' | 'en attente' | 'annulé'
        }));
        this.rdvs.set(formatted);
      },
      error: (err) => {
        this.messageErreur.set(err.error?.message || 'Erreur lors du chargement des rendez-vous');
      }
    });
  }

  ajouterOuModifierRdv(): void {
    this.messageErreur.set('');

    if (this.nouveauRdv.patientId && this.nouveauRdv.medecinId && this.nouveauRdv.motif && this.nouveauRdv.date && this.nouveauRdv.heure) {
      this.chargement.set(true);

      const payload = {
        patientId: Number(this.nouveauRdv.patientId),
        medecinId: Number(this.nouveauRdv.medecinId),
        motif: this.nouveauRdv.motif,
        date: this.nouveauRdv.date,
        heure: this.nouveauRdv.heure,
      };

      if (this.modeEdition()) {
        this.secretaireService.modifierRendezVous(this.nouveauRdv.id, payload).subscribe({
          next: () => {
            this.messageSucces.set('✅ Rendez-vous modifié avec succès !');
            this.reinitialiserFormulaire();
            this.chargement.set(false);
            this.chargerRendezVous();
            setTimeout(() => this.messageSucces.set(''), 3000);
          },
          error: (err) => {
            this.messageErreur.set(err.error?.message || 'Erreur lors de la modification');
            this.chargement.set(false);
          }
        });
      } else {
        this.secretaireService.creerRendezVous(payload).subscribe({
          next: () => {
            this.messageSucces.set('✅ Rendez-vous programmé avec succès !');
            this.reinitialiserFormulaire();
            this.chargement.set(false);
            this.chargerRendezVous();
            setTimeout(() => this.messageSucces.set(''), 3000);
          },
          error: (err) => {
            this.messageErreur.set(err.error?.message || 'Erreur lors de la création');
            this.chargement.set(false);
          }
        });
      }
      return;
    }

    this.messageErreur.set('Patient, médecin, motif, date et heure sont requis.');
  }

  chargerRdvPourEdition(rdv: RendezVousType): void {
    this.messageErreur.set('');
    this.nouveauRdv = {
      id: rdv.id,
      patientId: rdv.patientId,
      medecinId: rdv.medecinId,
      motif: rdv.motif,
      date: rdv.date,
      heure: rdv.heure,
    };
    this.modeEdition.set(true);
    this.afficherFormulaire.set(true);
  }

  confirmerRdv(id: number): void {
    const rdv = this.rdvs().find((r) => r.id === id);
    if (!rdv) return;

    this.secretaireService.modifierRendezVous(id, {
      date: rdv.date,
      heure: rdv.heure,
      motif: rdv.motif,
      statut: 'confirmé',
    }).subscribe({
      next: () => this.chargerRendezVous(),
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors de la confirmation')
    });
  }

  annulerRdv(id: number): void {
    this.secretaireService.annulerRendezVous(id).subscribe({
      next: () => this.chargerRendezVous(),
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors de l\'annulation')
    });
  }

  reinitialiserFormulaire(): void {
    this.nouveauRdv = { id: 0, patientId: 0, medecinId: 0, motif: '', date: '', heure: '' };
    this.modeEdition.set(false);
    this.afficherFormulaire.set(false);
  }
}