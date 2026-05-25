import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-planning-medecin',
  imports: [CommonModule, RouterLink],
  templateUrl: './planning-medecin.html',
  styleUrls: ['./planning-medecin.css']
})
export class PlanningMedecin implements OnInit {
  vue: 'jour' | 'semaine' | 'mois' = 'jour';
  dateActuelle = new Date();
  rendezVous: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerRdv();
  }

  chargerRdv() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/medecin/patients-jour`, { headers }).subscribe({
      next: (data: any) => this.rendezVous = data,
      error: (err) => console.error('Erreur planning:', err)
    });
  }

  jourPrecedent() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() - 1);
    this.dateActuelle = new Date(this.dateActuelle);
    this.chargerRdv();
  }

  jourSuivant() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() + 1);
    this.dateActuelle = new Date(this.dateActuelle);
    this.chargerRdv();
  }

  formaterDate(): string {
    return this.dateActuelle.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
semaine: any[] = [];
mois: any[] = [];
}