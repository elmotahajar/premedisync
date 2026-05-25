import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique.html',
  styleUrls: ['./historique.css']
})
export class Historique implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  historique: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.loadHistorique();
  }

  loadHistorique(): void {
    this.patientService.getHistorique().subscribe({
      next: (data) => {
        this.historique = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement historique:', err);
        this.loading = false;
      }
    });
  }

  voirDetails(id: number): void {
    this.router.navigate([`/dossier/${id}`]);
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}