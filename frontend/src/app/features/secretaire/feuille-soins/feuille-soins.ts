import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretaireService } from '../../../core/services/secretaire';

interface FeuilleSoinsData {
  id: number;
  patientId: number;
  patient: string;
  medecinId: number;
  medecin: string;
  date: string;
  actes: ActeSoins[];
  statut: 'TRANSMISE' | 'BROUILLON' | 'VALIDEE';
}

interface ActeSoins {
  code: string;
  libelle: string;
  quantite: number;
  prixUnitaire: number;
}

interface PersonOption {
  id: number;
  nom: string;
  prenom: string;
}

@Component({
  selector: 'app-feuille-soins',
  imports: [RouterLink, FormsModule],
  templateUrl: './feuille-soins.html',
  styleUrl: './feuille-soins.css',
})
export class FeuilleSOins implements OnInit {
  private secretaireService = inject(SecretaireService);

  feuilles = signal<FeuilleSoinsData[]>([]);
  patients = signal<PersonOption[]>([]);
  medecins = signal<PersonOption[]>([]);

  nouvelleFeuille = {
    patientId: 0,
    medecinId: 0,
    codeActe: '',
    descriptionActe: '',
    quantiteActe: 1,
    montantActe: 0,
    observations: ''
  };

  afficherFormulaire = signal(false);
  messageSucces = signal('');
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargerPatients();
    this.chargerMedecins();
    this.chargerFeuilles();
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

  chargerFeuilles(): void {
    this.secretaireService.listerFeuillesSoins().subscribe({
      next: (data: any[]) => {
        const mapped = (data || []).map((f: any) => ({
          id: f.id,
          patientId: Number(f.patientId),
          patient: f.patient ? `${f.patient.prenom} ${f.patient.nom}` : `Patient #${f.patientId}`,
          medecinId: Number(f.medecinId),
          medecin: f.medecin ? `Dr. ${f.medecin.prenom} ${f.medecin.nom}` : `Médecin #${f.medecinId}`,
          date: f.date,
          actes: Array.isArray(f.actes) ? f.actes : [],
          statut: (f.statut || 'BROUILLON') as 'TRANSMISE' | 'BROUILLON' | 'VALIDEE'
        }));
        this.feuilles.set(mapped);
      },
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors du chargement des feuilles')
    });
  }

  ajouterFeuille(): void {
    this.messageErreur.set('');

    if (this.nouvelleFeuille.patientId && this.nouvelleFeuille.medecinId && this.nouvelleFeuille.descriptionActe && this.nouvelleFeuille.montantActe > 0) {
      this.chargement.set(true);

      const data = {
        patientId: Number(this.nouvelleFeuille.patientId),
        medecinId: Number(this.nouvelleFeuille.medecinId),
        actes: [{
          code: this.nouvelleFeuille.codeActe || 'ACT',
          libelle: this.nouvelleFeuille.descriptionActe,
          quantite: Number(this.nouvelleFeuille.quantiteActe || 1),
          prixUnitaire: Number(this.nouvelleFeuille.montantActe),
        }],
        observations: this.nouvelleFeuille.observations || null,
      };

      this.secretaireService.creerFeuilleSoins(data).subscribe({
        next: () => {
          this.messageSucces.set('✅ Feuille de soins créée avec succès !');
          this.nouvelleFeuille = {
            patientId: 0,
            medecinId: 0,
            codeActe: '',
            descriptionActe: '',
            quantiteActe: 1,
            montantActe: 0,
            observations: ''
          };
          this.afficherFormulaire.set(false);
          this.chargement.set(false);
          this.chargerFeuilles();
          setTimeout(() => this.messageSucces.set(''), 3000);
        },
        error: (err) => {
          this.messageErreur.set(err.error?.message || 'Erreur lors de la création');
          this.chargement.set(false);
        }
      });
      return;
    }

    this.messageErreur.set('Patient, médecin, acte et montant sont requis.');
  }

  totalActes(actes: ActeSoins[]): number {
    return actes.reduce((sum, a) => sum + ((a.quantite || 1) * (a.prixUnitaire || 0)), 0);
  }

  transmettre(id: number): void {
    this.secretaireService.validerFeuilleSoins(id).subscribe({
      next: () => this.chargerFeuilles(),
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors de la validation')
    });
  }

  exporterPDF(feuille: FeuilleSoinsData): void {
    alert(`📄 Feuille de soins #${feuille.id}\nPatient : ${feuille.patient}\nMédecin : ${feuille.medecin}\nTotal : ${this.totalActes(feuille.actes)} MAD`);
  }
}