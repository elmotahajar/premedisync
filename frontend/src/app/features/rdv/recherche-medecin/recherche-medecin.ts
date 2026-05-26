import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-recherche-medecin',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './recherche-medecin.html',
  styleUrl: './recherche-medecin.css',
})
export class RechercheMedecin implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  specialiteChoisie = '';
  specialites: string[] = [];
  medecins = signal<any[]>([]);

  medecinsFiltres = computed(() => {
    return this.medecins().filter(m => {
      return !this.specialiteChoisie || m.specialite === this.specialiteChoisie;
    });
  });

  ngOnInit() {
    this.patientService.getMedecins().subscribe({
      next: (data) => {
        const doctors = Array.isArray(data) ? data : [];
        this.medecins.set(doctors);
        this.specialites = [...new Set(doctors.map((m: any) => m.specialite).filter(Boolean))];
      },
      error: (err) => console.error('Erreur médecins:', err)
    });
  }

  choisirMedecin(medecin: any): void {
    this.router.navigate(['/rdv/confirmation'], {
      state: { medecin }
    });
  }
}