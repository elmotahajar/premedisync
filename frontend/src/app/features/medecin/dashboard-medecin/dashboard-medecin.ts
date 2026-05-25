import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-medecin',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-medecin.html',
  styleUrls: ['./dashboard-medecin.css']
})
export class DashboardMedecin implements OnInit {
  medecin: any = {};
  rendezVousAujourdhui: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/medecin/profil`, { headers }).subscribe({
      next: (data: any) => this.medecin = data,
      error: (err) => console.error('Erreur profil:', err)
    });

    this.http.get(`${this.apiUrl}/medecin/patients-jour`, { headers }).subscribe({
      next: (data: any) => this.rendezVousAujourdhui = data,
      error: (err) => console.error('Erreur RDV:', err)
    });
  }

  consulter(id: number) {
    window.location.href = `/medecin/consultation/${id}`;
  }
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login';
}
}