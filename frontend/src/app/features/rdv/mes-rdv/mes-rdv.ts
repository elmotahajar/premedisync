import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { PatientService } from '../../../core/services/patient.service';
import { RdvService } from '../../../core/services/rdv.service';

interface DoctorOption {
  id: number;
  nom: string;
  specialite?: string;
  ville?: string;
}

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-rdv.html',
  styleUrls: ['./mes-rdv.css']
})
export class MesRdv implements OnInit {
  private router = inject(Router);
  private rdvService = inject(RdvService);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  message = signal('');
  rendezVous = signal<any[]>([]);
  medecins = signal<DoctorOption[]>([]);

  searchMedecin = '';
  selectedDoctorId = '';
  selectedDate = '';
  selectedHeure = '';
  motif = '';

  readonly creneaux = this.buildSlots('08:00', '17:00', 30);

  ngOnInit(): void {
    this.loadData();
  }

  filteredMedecins = computed(() => {
    const query = this.searchMedecin.trim().toLowerCase();
    return this.medecins().filter((medecin) => {
      const searchable = `${medecin.nom} ${medecin.specialite || ''} ${medecin.ville || ''}`.toLowerCase();
      return !query || searchable.includes(query);
    });
  });

  get creneauxDisponibles(): string[] {
    if (!this.selectedDoctorId || !this.selectedDate) {
      return this.creneaux;
    }

    const booked = new Set(
      this.rendezVous()
        .filter((rdv) => (rdv.medecinId ?? rdv.doctorId) === Number(this.selectedDoctorId) && rdv.date === this.selectedDate && rdv.statut !== 'annulé')
        .map((rdv) => rdv.heure)
    );

    return this.creneaux.filter((slot) => !booked.has(slot));
  }

  loadData(): void {
    const patientId = this.authService.getPatientId();
    if (!patientId) {
      this.error.set('Session expirée. Veuillez vous reconnecter.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      medecins: this.patientService.getMedecins(),
      rendezVous: this.rdvService.getPatientRendezVous(patientId)
    }).subscribe({
      next: (response: any) => {
        this.medecins.set(Array.isArray(response.medecins) ? response.medecins : []);
        this.rendezVous.set(Array.isArray(response.rendezVous) ? response.rendezVous : []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement rendez-vous patient:', error);
        this.error.set('Impossible de charger vos rendez-vous et médecins.');
        this.loading.set(false);
      }
    });
  }

  choisirMedecin(id: string): void {
    this.selectedDoctorId = id;
    this.selectedHeure = '';
  }

  creerRdv(): void {
    if (!this.selectedDoctorId || !this.selectedDate || !this.selectedHeure || !this.motif.trim()) {
      this.error.set('Veuillez choisir un médecin, une date, un créneau et un motif.');
      return;
    }

    const patientId = this.authService.getPatientId();
    if (!patientId) {
      this.error.set('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.rdvService.create({
      patientId: patientId,
      medecinId: Number(this.selectedDoctorId),
      date: this.selectedDate,
      heure: this.selectedHeure,
      motif: this.motif.trim()
    }).subscribe({
      next: () => {
        this.message.set('Rendez-vous créé avec succès.');
        this.resetForm();
        this.loadData();
        this.saving.set(false);
        setTimeout(() => this.message.set(''), 3500);
      },
      error: (error) => {
        console.error('Erreur création rendez-vous:', error);
        this.error.set(error?.error?.message || 'Impossible de créer le rendez-vous.');
        this.saving.set(false);
      }
    });
  }

  annulerRdv(id: number): void {
    if (!confirm('Annuler ce rendez-vous ?')) {
      return;
    }

    this.rdvService.delete(id).subscribe({
      next: () => {
        this.message.set('Rendez-vous annulé.');
        this.loadData();
        setTimeout(() => this.message.set(''), 3000);
      },
      error: (error) => {
        console.error('Erreur annulation rendez-vous:', error);
        this.error.set('Impossible d’annuler ce rendez-vous.');
      }
    });
  }

  retour(): void {
    this.router.navigate(['/patient/accueil']);
  }

  private resetForm(): void {
    this.selectedDoctorId = '';
    this.selectedDate = '';
    this.selectedHeure = '';
    this.motif = '';
  }

  private buildSlots(startTime: string, endTime: string, stepMinutes: number): string[] {
    const slots: string[] = [];
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const current = new Date();
    current.setHours(startHours, startMinutes, 0, 0);
    const end = new Date();
    end.setHours(endHours, endMinutes, 0, 0);

    while (current < end) {
      const hours = String(current.getHours()).padStart(2, '0');
      const minutes = String(current.getMinutes()).padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + stepMinutes);
    }

    return slots;
  }
}