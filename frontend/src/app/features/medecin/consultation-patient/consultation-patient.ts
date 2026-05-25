import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-consultation-patient',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './consultation-patient.html',
  styleUrl: './consultation-patient.css',
})
export class ConsultationPatient implements OnInit {
  patientId: string | null = null;
  ongletActif: 'dossier' | 'compte-rendu' = 'dossier';
  patient: any = {};
  dossier: any = { allergies: [], antecedents: [], traitementsEnCours: [], historique: [] };
  compteRendu = {
    symptomes: '',
    diagnostic: '',
    traitement: '',
    recommandations: '',
    date: new Date()
  };
  private apiUrl = 'http://localhost:3000/api';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Charger dossier patient
    this.http.get(`${this.apiUrl}/medecin/compte-rendu/${this.patientId}`, { headers }).subscribe({
      next: (data: any) => {
        this.patient = data.patient || {};
        this.dossier = data.dossier || this.dossier;
      },
      error: (err) => console.error('Erreur dossier:', err)
    });
  }

  changerOnglet(onglet: 'dossier' | 'compte-rendu') {
    this.ongletActif = onglet;
  }

  sauvegarderCompteRendu() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${this.apiUrl}/medecin/compte-rendu`, {
      patientId: this.patientId,
      ...this.compteRendu
    }, { headers }).subscribe({
      next: () => alert('Compte rendu sauvegardé avec succès !'),
      error: (err) => console.error('Erreur sauvegarde:', err)
    });
  }

  genererPrescription() {
    window.location.href = '/medecin/prescription';
  }
}