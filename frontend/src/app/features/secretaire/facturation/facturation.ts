import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretaireService } from '../../../core/services/secretaire';

interface Facture {
  id: number;
  patient: string;
  medecin: string;
  date: string;
  actes: string[];
  montantTotal: number;
  statut: 'payée' | 'en attente' | 'annulée';
}

@Component({
  selector: 'app-facturation',
  imports: [RouterLink, FormsModule],
  templateUrl: './facturation.html',
  styleUrl: './facturation.css',
})
export class Facturation implements OnInit {
  private secretaireService = inject(SecretaireService);

  factures = signal<Facture[]>([]);

  nouvelleFacture = {
    patient: '',
    medecin: '',
    date: '',
    acte: '',
    montantTotal: 0
  };

  afficherFormulaire = signal(false);
  messageSucces = signal('');
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit() {
    this.chargerFactures();
  }

  chargerFactures() {
    // Les factures seront chargées depuis le backend
    this.factures.set([]);
  }

  ajouterFacture(): void {
    if (this.nouvelleFacture.patient && this.nouvelleFacture.montantTotal > 0) {
      this.chargement.set(true);

      const data = {
        patient: this.nouvelleFacture.patient,
        medecin: this.nouvelleFacture.medecin,
        date: this.nouvelleFacture.date,
        actes: [this.nouvelleFacture.acte],
        montantTotal: this.nouvelleFacture.montantTotal,
        statut: 'en attente'
      };

      this.secretaireService.emettreFacture(data).subscribe({
        next: (reponse: any) => {
          this.messageSucces.set(`✅ Facture créée pour ${this.nouvelleFacture.patient} !`);
          this.nouvelleFacture = { patient: '', medecin: '', date: '', acte: '', montantTotal: 0 };
          this.afficherFormulaire.set(false);
          this.chargement.set(false);
          setTimeout(() => this.messageSucces.set(''), 3000);
        },
        error: (err) => {
          this.messageErreur.set(err.error?.message || 'Erreur lors de la création');
          this.chargement.set(false);
        }
      });
    }
  }

  marquerPayee(id: number): void {
    this.factures.update(liste =>
      liste.map(f => f.id === id ? { ...f, statut: 'payée' as const } : f)
    );
  }

  annulerFacture(id: number): void {
    this.factures.update(liste =>
      liste.map(f => f.id === id ? { ...f, statut: 'annulée' as const } : f)
    );
  }

  exporterPDF(facture: Facture): void {
    this.secretaireService.getFacturePDF(facture.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture_${facture.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert(`📄 Facture #${facture.id} — ${facture.patient} — ${facture.montantTotal} MAD`);
      }
    });
  }
}