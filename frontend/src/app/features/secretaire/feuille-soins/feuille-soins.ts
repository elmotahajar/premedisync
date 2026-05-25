import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FeuilleSoinsData {
  id: number;
  patient: string;
  medecin: string;
  date: string;
  actes: ActeSoins[];
  mutuelle: string;
  statut: 'transmise' | 'en attente' | 'remboursée';
}

interface ActeSoins {
  code: string;
  description: string;
  montant: number;
}

@Component({
  selector: 'app-feuille-soins',
  imports: [RouterLink, FormsModule],
  templateUrl: './feuille-soins.html',
  styleUrl: './feuille-soins.css',
})
export class FeuilleSOins {
  feuilles = signal<FeuilleSoinsData[]>([
    {
      id: 1,
      patient: 'Ahmed Benali',
      medecin: 'Dr. Alaoui',
      date: '2026-05-20',
      actes: [
        { code: 'C', description: 'Consultation générale', montant: 250 },
        { code: 'B', description: 'Prise de sang', montant: 100 }
      ],
      mutuelle: 'CNSS',
      statut: 'transmise'
    },
    {
      id: 2,
      patient: 'Fatima Zahra',
      medecin: 'Dr. Idrissi',
      date: '2026-05-21',
      actes: [
        { code: 'CS', description: 'Consultation spécialisée', montant: 400 }
      ],
      mutuelle: 'CNOPS',
      statut: 'en attente'
    },
  ]);

  nouvelleFeuille = {
    patient: '',
    medecin: '',
    date: '',
    mutuelle: '',
    codeActe: '',
    descriptionActe: '',
    montantActe: 0
  };

  afficherFormulaire = signal(false);
  messageSucces = signal('');

  ajouterFeuille(): void {
    if (this.nouvelleFeuille.patient && this.nouvelleFeuille.medecin && this.nouvelleFeuille.date) {
      const feuille: FeuilleSoinsData = {
        id: Date.now(),
        patient: this.nouvelleFeuille.patient,
        medecin: this.nouvelleFeuille.medecin,
        date: this.nouvelleFeuille.date,
        mutuelle: this.nouvelleFeuille.mutuelle,
        actes: [{
          code: this.nouvelleFeuille.codeActe,
          description: this.nouvelleFeuille.descriptionActe,
          montant: this.nouvelleFeuille.montantActe
        }],
        statut: 'en attente'
      };
      this.feuilles.update(liste => [...liste, feuille]);
      this.messageSucces.set(`✅ Feuille de soins créée pour ${feuille.patient} !`);
      this.nouvelleFeuille = { patient: '', medecin: '', date: '', mutuelle: '', codeActe: '', descriptionActe: '', montantActe: 0 };
      this.afficherFormulaire.set(false);
      setTimeout(() => this.messageSucces.set(''), 3000);
    }
  }

  totalActes(actes: ActeSoins[]): number {
    return actes.reduce((sum, a) => sum + a.montant, 0);
  }

  transmettre(id: number): void {
    this.feuilles.update(liste =>
      liste.map(f => f.id === id ? { ...f, statut: 'transmise' as const } : f)
    );
  }

  exporterPDF(feuille: FeuilleSoinsData): void {
    alert(`📄 Feuille de soins #${feuille.id}\nPatient : ${feuille.patient}\nMédecin : ${feuille.medecin}\nTotal : ${this.totalActes(feuille.actes)} MAD`);
  }
}