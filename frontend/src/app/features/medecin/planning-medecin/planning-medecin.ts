import { Component, OnInit, signal } from '@angular/core';
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
  rendezVous = signal<any[]>([]);
  chargement = signal(false);
  medecinId: string | null = null;
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Extraire l'ID du médecin depuis le JWT
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.medecinId = payload.id || payload.userId;
    } catch (e) {
      console.error('Erreur décodage token:', e);
    }

    this.chargerRdv();
  }

  /**
   * Charge les rendez-vous du médecin pour la date actuelle
   */
  chargerRdv() {
    if (!this.medecinId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.chargement.set(true);

    // Format la date pour l'API (YYYY-MM-DD)
    const dateStr = this.dateActuelle.toISOString().split('T')[0];

    this.http.get(`${this.apiUrl}/rendezvous/medecin/${this.medecinId}?date=${dateStr}`, { headers }).subscribe({
      next: (data: any) => {
        this.rendezVous.set(Array.isArray(data) ? data : data?.rendezVous || []);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement planning:', err);
        this.chargement.set(false);
      }
    });
  }

  /**
   * Navigue vers le jour précédent
   */
  jourPrecedent() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() - 1);
    this.dateActuelle = new Date(this.dateActuelle);
    this.chargerRdv();
  }

  /**
   * Navigue vers le jour suivant
   */
  jourSuivant() {
    this.dateActuelle.setDate(this.dateActuelle.getDate() + 1);
    this.dateActuelle = new Date(this.dateActuelle);
    this.chargerRdv();
  }

  /**
   * Formate la date actuelle en français
   */
  formaterDate(): string {
    return this.dateActuelle.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  semaine: any[] = [];
  mois: any[] = [];
}