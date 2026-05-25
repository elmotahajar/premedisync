import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste.html',
  styleUrls: ['./liste.css']
})
export class Liste implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  ordonnances: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.loadOrdonnances();
  }

  loadOrdonnances(): void {
    this.patientService.getOrdonnances().subscribe({
      next: (data) => {
        this.ordonnances = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement ordonnances:', err);
        this.loading = false;
      }
    });
  }

  telechargerPdf(id: number): void {
    // À implémenter avec le backend
    console.log('Téléchargement ordonnance:', id);
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}