import { Component, OnInit } from '@angular/core';
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
  disponibilites: any[] = [];
  congesSpeciaux: any[] = [];
  dureeConsultation = 30;
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
    this.chargerDisponibilites();
  }

  chargerDisponibilites() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/medecin/planning`, { headers }).subscribe({
      next: (data: any) => this.disponibilites = data,
      error: (err) => console.error('Erreur disponibilités:', err)
    });

    this.http.get(`${this.apiUrl}/medecin/conges`, { headers }).subscribe({
      next: (data: any) => this.congesSpeciaux = data,
      error: (err) => console.error('Erreur congés:', err)
    });
  }

  sauvegarderDisponibilites() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const joursActifs = this.joursSemaine.filter(j => j.actif);
    joursActifs.forEach(jour => {
      this.http.post(`${this.apiUrl}/medecin/disponibilite`, {
        jour: jour.nom,
        heureDebut: jour.debut,
        heureFin: jour.fin,
        estConge: false,
      }, { headers }).subscribe();
    });

    alert('Disponibilités sauvegardées !');
  }

  ajouterConge() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${this.apiUrl}/medecin/conge`, {
      jour: this.nouveauConge.dateDebut,
      heureDebut: '00:00',
      heureFin: '23:59',
      estConge: true,
    }, { headers }).subscribe({
      next: () => {
        this.chargerDisponibilites();
        this.nouveauConge = { dateDebut: '', dateFin: '', motif: '' };
      },
      error: (err) => console.error('Erreur congé:', err)
    });
  }

  supprimerConge(index: number) {
    const conge = this.congesSpeciaux[index];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/medecin/conge/${conge.id}`, { headers }).subscribe({
      next: () => this.chargerDisponibilites(),
      error: (err) => console.error('Erreur suppression:', err)
    });
  }
}