import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  patientNom: string = '';
  patientPrenom: string = '';
  prochainRdv: string = 'Aucun rendez-vous';
  loading: boolean = true;

  ngOnInit(): void {
    this.loadPatientData();
  }

  loadPatientData(): void {
    this.patientService.getProfil().subscribe({
      next: (data) => {
        this.patientNom = data.nom;
        this.patientPrenom = data.prenom;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        this.loading = false;
      }
    });
  }

  seDeconnecter(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}