import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-disponibilites-medecin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './disponibilites-medecin.html',
  styleUrls: ['./disponibilites-medecin.css']
})
export class DisponibilitesMedecin implements OnInit {
  medecinId: string | null = null;
  disponibilites: any[] = [];
  congesSpeciaux: any[] = [];
  dureeConsultation = 30;
  chargement = signal(false);
  sauvegarde = signal(false);
  
  joursSemaine = [
    { nom: 'Lundi',    actif: false, debut: '08:00', fin: '17:00', pause: false, pauseDebut: '12:00', pauseFin: '13:00' },
    { nom: 'Mardi',    actif: false, debut: '08:00', fin: '17:00', pause: false, pauseDebut: '12:00', pauseFin: '13:00' },
    { nom: 'Mercredi', actif: false, debut: '08:00', fin: '12:00', pause: false, pauseDebut: '',      pauseFin: ''      },
    { nom: 'Jeudi',    actif: false, debut: '08:00', fin: '17:00', pause: false, pauseDebut: '12:00', pauseFin: '13:00' },
    { nom: 'Vendredi', actif: false, debut: '08:00', fin: '16:00', pause: false, pauseDebut: '12:00', pauseFin: '13:00' },
    { nom: 'Samedi',   actif: false, debut: '',      fin: '',      pause: false, pauseDebut: '',      pauseFin: ''      },
    { nom: 'Dimanche', actif: false, debut: '',      fin: '',      pause: false, pauseDebut: '',      pauseFin: ''      },
  ];
  nouveauConge = { dateDebut: '', dateFin: '', motif: '' };
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

    this.chargerDisponibilites();
  }

  /**
   * Charge les disponibilités existantes et pré-remplit le formulaire
   */
  chargerDisponibilites() {
    if (!this.medecinId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.chargement.set(true);

    this.http.get(`${this.apiUrl}/disponibilites/medecin/${this.medecinId}`, { headers }).subscribe({
      next: (data: any) => {
        if (data) {
          // Pré-remplir les jours de la semaine
          if (data.joursSemaine && Array.isArray(data.joursSemaine)) {
            this.joursSemaine = data.joursSemaine;
          }
          // Charger la durée de consultation
          if (data.dureeConsultation) {
            this.dureeConsultation = data.dureeConsultation;
          }
        }
        this.chargerConges();
      },
      error: (err) => {
        console.error('Erreur chargement disponibilités:', err);
        this.chargement.set(false);
      }
    });
  }

  /**
   * Charge les congés spéciaux
   */
  chargerConges() {
    if (!this.medecinId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/conges/medecin/${this.medecinId}`, { headers }).subscribe({
      next: (data: any) => {
        this.congesSpeciaux = Array.isArray(data) ? data : data?.conges || [];
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement congés:', err);
        this.chargement.set(false);
      }
    });
  }

  /**
   * Sauvegarde les disponibilités et congés du médecin
   */
  sauvegarderDisponibilites() {
    if (!this.medecinId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.sauvegarde.set(true);

    const payload = {
      dureeConsultation: this.dureeConsultation,
      joursSemaine: this.joursSemaine
    };

    this.http.put(`${this.apiUrl}/disponibilites/medecin/${this.medecinId}`, payload, { headers }).subscribe({
      next: () => {
        alert('Disponibilités sauvegardées avec succès !');
        this.sauvegarde.set(false);
        this.chargerDisponibilites();
      },
      error: (err) => {
        console.error('Erreur sauvegarde:', err);
        alert('Erreur lors de la sauvegarde');
        this.sauvegarde.set(false);
      }
    });
  }

  /**
   * Ajoute un congé spécial
   */
  ajouterConge() {
    if (!this.medecinId || !this.nouveauConge.dateDebut) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      dateDebut: this.nouveauConge.dateDebut,
      dateFin: this.nouveauConge.dateFin || this.nouveauConge.dateDebut,
      motif: this.nouveauConge.motif
    };

    this.http.post(`${this.apiUrl}/conges/medecin/${this.medecinId}`, payload, { headers }).subscribe({
      next: () => {
        alert('Congé ajouté avec succès !');
        this.nouveauConge = { dateDebut: '', dateFin: '', motif: '' };
        this.chargerConges();
      },
      error: (err) => {
        console.error('Erreur congé:', err);
        alert('Erreur lors de l\'ajout du congé');
      }
    });
  }

  /**
   * Supprime un congé spécial
   */
  supprimerConge(index: number) {
    if (!this.medecinId) return;

    const conge = this.congesSpeciaux[index];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/conges/${conge.id}`, { headers }).subscribe({
      next: () => {
        alert('Congé supprimé avec succès !');
        this.chargerConges();
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }
}