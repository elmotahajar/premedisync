import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../../../core/services/billing.service';

interface Facture {
  id: number;
  patientNom: string;
  patientPrenom: string;
  date: string;
  montant: number;
  statut: 'payee' | 'impayee' | 'en_attente';
  type: string;
}

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturation.html',
  styleUrls: ['./facturation.css']
})
export class Facturation implements OnInit {
  constructor(private router: Router, private billingService: BillingService) {}

  factures: Facture[] = [
    { id: 1, patientNom: 'Dupont', patientPrenom: 'Jean', date: '2026-05-15', montant: 25, statut: 'payee', type: 'Consultation' },
    { id: 2, patientNom: 'Bernard', patientPrenom: 'Marie', date: '2026-05-10', montant: 50, statut: 'payee', type: 'Cardiologie' },
    { id: 3, patientNom: 'Petit', patientPrenom: 'Sophie', date: '2026-05-05', montant: 45, statut: 'impayee', type: 'Dermatologie' },
    { id: 4, patientNom: 'Martin', patientPrenom: 'Lucas', date: '2026-04-28', montant: 35, statut: 'en_attente', type: 'Pédiatrie' },
    { id: 5, patientNom: 'Dubois', patientPrenom: 'Claire', date: '2026-05-20', montant: 25, statut: 'impayee', type: 'Consultation' }
  ];

  filtreStatut: string = 'tous';
  message = '';
  loading = true;
  summary = {
    totalRevenue: 0,
    unpaidAmount: 0,
    paidCount: 0,
    unpaidCount: 0
  };

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.billingService.getFinancialSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.summary = {
          totalRevenue: this.totalGeneral,
          unpaidAmount: this.totalImpaye,
          paidCount: this.factures.filter(f => f.statut === 'payee').length,
          unpaidCount: this.factures.filter(f => f.statut !== 'payee').length
        };
        this.loading = false;
      }
    });

    this.billingService.getAllInvoices().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.factures = data;
        } else if (data?.items) {
          this.factures = data.items;
        }
      },
      error: () => {
        // Keep the existing mock data as a safe fallback.
      }
    });
  }

  get facturesFiltrees() {
    if (this.filtreStatut === 'tous') return this.factures;
    return this.factures.filter(f => f.statut === this.filtreStatut);
  }

  get totalPaye(): number {
    return this.factures.filter(f => f.statut === 'payee').reduce((sum, f) => sum + f.montant, 0);
  }

  get totalImpaye(): number {
    return this.factures.filter(f => f.statut === 'impayee').reduce((sum, f) => sum + f.montant, 0);
  }

  get totalEnAttente(): number {
    return this.factures.filter(f => f.statut === 'en_attente').reduce((sum, f) => sum + f.montant, 0);
  }

  get totalGeneral(): number {
    return this.factures.reduce((sum, f) => sum + f.montant, 0);
  }

  marquerPayee(facture: Facture) {
    facture.statut = 'payee';
    this.billingService.updatePaymentStatus(facture.id, 'payee').subscribe({
      next: () => {
        this.message = `Facture ${facture.id} marquée comme payée`;
        setTimeout(() => this.message = '', 2000);
      },
      error: () => {
        this.message = `Facture ${facture.id} marquée localement`;
        setTimeout(() => this.message = '', 2000);
      }
    });
  }

  exporterPdf(facture: Facture) {
    this.billingService.generateInvoicePDF(facture.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.message = `PDF généré pour la facture ${facture.id}`;
        setTimeout(() => this.message = '', 2000);
      },
      error: () => {
        this.message = 'Export PDF indisponible pour le moment';
        setTimeout(() => this.message = '', 2000);
      }
    });
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'payee': return 'badge payee';
      case 'impayee': return 'badge impayee';
      case 'en_attente': return 'badge attente';
      default: return 'badge';
    }
  }

  getStatutTexte(statut: string): string {
    switch(statut) {
      case 'payee': return 'Payée';
      case 'impayee': return 'Impayée';
      case 'en_attente': return 'En attente';
      default: return statut;
    }
  }

  retour() {
    this.router.navigate(['/admin/accueil']);
  }
}
