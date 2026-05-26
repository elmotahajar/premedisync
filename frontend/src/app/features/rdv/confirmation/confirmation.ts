import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../../core/services/rdv.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-confirmation',
  imports: [FormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  private router = inject(Router);
  private rdvService = inject(RdvService);
  private authService = inject(AuthService);

  medecin = history.state.medecin ?? null;
  
  motif = '';
  date = '';
  heure = '';
  pourTiers = false;
  nomTiers = '';
  
  confirme = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  creneaux = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  retour(): void {
    this.router.navigate(['/patient/rendezvous']);
  }

  confirmerRdv(): void {
    if (!this.medecin) {
      this.error.set('Aucun médecin sélectionné. Veuillez revenir à la recherche de médecin.');
      return;
    }

    if (!this.date || !this.heure || !this.motif) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const rdvData = {
      patientId: this.authService.getPatientId(),
      medecinId: this.medecin.id,
      date: this.date,
      heure: this.heure,
      motif: this.motif
    };

    this.rdvService.create(rdvData).subscribe({
      next: () => {
        this.confirme.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur confirmation RDV:', err);
        this.error.set(err?.error?.message || 'Une erreur est survenue lors de la réservation.');
        this.loading.set(false);
      }
    });
  }
}