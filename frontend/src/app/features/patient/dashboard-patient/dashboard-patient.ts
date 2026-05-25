import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-patient',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="max-width:900px; margin:0 auto; padding:24px; font-family:'Segoe UI',sans-serif;">
      <header style="display:flex; justify-content:space-between; align-items:center; background:white; padding:16px 24px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); margin-bottom:24px;">
        <h1 style="margin:0; color:#1a1a2e;">MediSync</h1>
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="color:#555;">{{ patient.prenom }} {{ patient.nom }}</span>
          <button (click)="logout()" style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer;">Se déconnecter</button>
        </div>
      </header>

      <h2 style="color:#1a1a2e;">Espace Patient</h2>

      <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:24px;">
        <div routerLink="/rdv" style="background:white; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; text-align:center;">
          <div style="font-size:2rem;">📅</div>
          <h3 style="color:#1a1a2e;">Prendre RDV</h3>
          <p style="color:#555;">Rechercher un médecin et prendre rendez-vous</p>
        </div>
        <div routerLink="/dossier" style="background:white; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; text-align:center;">
          <div style="font-size:2rem;">📋</div>
          <h3 style="color:#1a1a2e;">Dossier médical</h3>
          <p style="color:#555;">Consulter votre historique médical</p>
        </div>
        <div routerLink="/ordonnances" style="background:white; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; text-align:center;">
          <div style="font-size:2rem;">💊</div>
          <h3 style="color:#1a1a2e;">Ordonnances</h3>
          <p style="color:#555;">Accéder à vos ordonnances électroniques</p>
        </div>
        <div routerLink="/patient/profil" style="background:white; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; text-align:center;">
          <div style="font-size:2rem;">👤</div>
          <h3 style="color:#1a1a2e;">Mon profil</h3>
          <p style="color:#555;">Gérer vos informations personnelles</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardPatient implements OnInit {
  patient: any = {};
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/patient/profil`, { headers }).subscribe({
      next: (data: any) => this.patient = data,
      error: (err) => console.error('Erreur profil:', err)
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
}