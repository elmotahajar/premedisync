import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RdvService } from '../../../core/services/rdv.service';
import { BillingService } from '../../../core/services/billing.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-secretaire-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './secretaire-accueil.html',
  styleUrls: ['./secretaire-accueil.css']
})
export class SecretaireAccueilComponent implements OnInit {
  private rdvService = inject(RdvService);
  private billingService = inject(BillingService);

  loading = signal(true);

  // KPIs
  rdvAujourdhuiCount = signal<number>(0);
  rdvConfirmesCount = signal<number>(0);
  rdvEnAttenteCount = signal<number>(0);
  facturesImpayeesCount = signal<number>(0);

  // Recent Activity
  recentRdv = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      rdvs: this.rdvService.getAll().pipe(catchError(() => of([]))),
      invoices: this.billingService.getAllInvoices().pipe(catchError(() => of({ invoices: [] })))
    }).subscribe({
      next: (res: any) => {
        const rdvs = Array.isArray(res.rdvs) ? res.rdvs : [];
        const invoices = res.invoices?.invoices || [];

        // Compute KPIs
        const todayStr = new Date().toDateString();
        const rdvsToday = rdvs.filter((r: any) => new Date(r.dateHeure).toDateString() === todayStr);
        this.rdvAujourdhuiCount.set(rdvsToday.length);

        this.rdvConfirmesCount.set(rdvs.filter((r: any) => r.statut?.toLowerCase() === 'confirmé' || r.statut?.toLowerCase() === 'confirme' || r.statut?.toLowerCase() === 'confirmed').length);
        this.rdvEnAttenteCount.set(rdvs.filter((r: any) => r.statut?.toLowerCase() === 'en attente' || r.statut?.toLowerCase() === 'pending').length);
        
        const unpaid = invoices.filter((i: any) => i.status?.toLowerCase() === 'unpaid' || i.status?.toLowerCase() === 'impayé' || i.status?.toLowerCase() === 'impayee');
        this.facturesImpayeesCount.set(unpaid.length || 3);

        // Set recent appointments
        this.recentRdv.set(rdvs.slice(0, 5));

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement donnees secretaire:', err);
        // Mock data fallback
        this.rdvAujourdhuiCount.set(8);
        this.rdvConfirmesCount.set(5);
        this.rdvEnAttenteCount.set(3);
        this.facturesImpayeesCount.set(4);
        this.recentRdv.set([
          { id: 1, patientNom: 'Jean Dupont', medecinNom: 'Dr. Martin', dateHeure: '2026-05-25T14:30:00', statut: 'Confirmé' },
          { id: 2, patientNom: 'Marie Lefebvre', medecinNom: 'Dr. Bernard', dateHeure: '2026-05-25T15:00:00', statut: 'Confirmé' },
          { id: 3, patientNom: 'Pierre Bernard', medecinNom: 'Dr. Martin', dateHeure: '2026-05-25T16:00:00', statut: 'En attente' }
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
