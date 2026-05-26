import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretaireService } from '../../../core/services/secretaire';

interface Facture {
  id: number;
  patientId: number;
  patient: string;
  date: string;
  actes: Array<{ code: string; libelle: string; quantite: number; prix: number }>;
  montantTotal: number;
  montantPaye: number;
  statut: 'PAYEE' | 'EN_ATTENTE' | 'ANNULEE' | 'IMPAYEE';
}

interface PatientOption {
  id: number;
  nom: string;
  prenom: string;
}

@Component({
  selector: 'app-facturation',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './facturation.html',
  styleUrl: './facturation.css',
})
export class Facturation implements OnInit {
  private secretaireService = inject(SecretaireService);

  factures = signal<Facture[]>([]);
  patients = signal<PatientOption[]>([]);

  nouvelleFacture = {
    patientId: 0,
    date: '',
    codeActe: '',
    libelleActe: '',
    quantite: 1,
    prix: 0
  };

  afficherFormulaire = signal(false);
  messageSucces = signal('');
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit() {
    this.chargerPatients();
    this.chargerFactures();
  }

  chargerPatients() {
    this.secretaireService.listerPatients().subscribe({
      next: (data) => this.patients.set(data),
      error: () => this.messageErreur.set('Erreur lors du chargement des patients')
    });
  }

  chargerFactures() {
    this.secretaireService.listerFactures().subscribe({
      next: (data: any[]) => {
        const mapped = (data || []).map((f: any) => ({
          id: f.id,
          patientId: f.patientId,
          patient: f.patient ? `${f.patient.prenom} ${f.patient.nom}` : `Patient #${f.patientId}`,
          date: f.dateEmission,
          actes: Array.isArray(f.actes) ? f.actes : [],
          montantTotal: f.montantTotal || 0,
          montantPaye: f.montantPaye || 0,
          statut: (f.statut || 'EN_ATTENTE') as 'PAYEE' | 'EN_ATTENTE' | 'ANNULEE' | 'IMPAYEE'
        }));
        this.factures.set(mapped);
      },
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors du chargement des factures')
    });
  }

  ajouterFacture(): void {
    this.messageErreur.set('');

    if (this.nouvelleFacture.patientId && this.nouvelleFacture.libelleActe && this.nouvelleFacture.prix > 0) {
      this.chargement.set(true);

      const data = {
        patientId: Number(this.nouvelleFacture.patientId),
        actes: [{
          code: this.nouvelleFacture.codeActe || 'ACT',
          libelle: this.nouvelleFacture.libelleActe,
          quantite: Number(this.nouvelleFacture.quantite || 1),
          prix: Number(this.nouvelleFacture.prix),
        }],
        dateEcheance: this.nouvelleFacture.date || null,
      };

      this.secretaireService.emettreFacture(data).subscribe({
        next: () => {
          this.messageSucces.set('✅ Facture créée avec succès !');
          this.nouvelleFacture = { patientId: 0, date: '', codeActe: '', libelleActe: '', quantite: 1, prix: 0 };
          this.afficherFormulaire.set(false);
          this.chargement.set(false);
          this.chargerFactures();
          setTimeout(() => this.messageSucces.set(''), 3000);
        },
        error: (err) => {
          this.messageErreur.set(err.error?.message || 'Erreur lors de la création');
          this.chargement.set(false);
        }
      });
      return;
    }

    this.messageErreur.set('Patient, libellé acte et prix sont requis.');
  }

  marquerPayee(id: number): void {
    const facture = this.factures().find((f) => f.id === id);
    if (!facture) return;

    const restant = Math.max(0, facture.montantTotal - (facture.montantPaye || 0));
    this.secretaireService.enregistrerPaiement(id, restant).subscribe({
      next: () => this.chargerFactures(),
      error: (err) => this.messageErreur.set(err.error?.message || 'Erreur lors du paiement')
    });
  }

  annulerFacture(id: number): void {
    this.messageErreur.set('Annulation de facture non disponible via API pour le moment.');
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