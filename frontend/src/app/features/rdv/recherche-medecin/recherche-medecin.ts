import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recherche-medecin',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './recherche-medecin.html',
  styleUrl: './recherche-medecin.css',
})
export class RechercheMedecin implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  specialiteChoisie = '';
  specialites: string[] = [];
  private apiUrl = 'http://localhost:3000/api';

  medecins = signal<any[]>([]);

  medecinsFiltres = computed(() => {
    return this.medecins().filter(m => {
      return !this.specialiteChoisie || m.specialite === this.specialiteChoisie;
    });
  });

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/patient/medecins`, { headers }).subscribe({
      next: (data) => {
        this.medecins.set(data);
        // Extraire les spécialités uniques
        this.specialites = [...new Set(data.map((m: any) => m.specialite).filter(Boolean))];
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