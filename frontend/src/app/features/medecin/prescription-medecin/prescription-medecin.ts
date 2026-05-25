import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-prescription-medecin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prescription-medecin.html',
  styleUrls: ['./prescription-medecin.css']
})
export class PrescriptionMedecin implements OnInit {
  patients: any[] = [];
  patientSelectionne: any = null;
  rechercheMedicament = '';
  medicamentsAjoutes: string[] = [];
  prescription = {
    patientId: null,
    medicaments: [] as string[],
    duree: '7',
    posologie: '',
    remarques: ''
  };
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/medecin/patients-jour`, { headers }).subscribe({
      next: (data: any) => this.patients = data,
      error: (err) => console.error('Erreur patients:', err)
    });
  }

  selectionnerPatient(patient: any) {
    this.patientSelectionne = patient;
    this.prescription.patientId = patient.id;
  }

  ajouterMedicament() {
    if (this.rechercheMedicament && !this.medicamentsAjoutes.includes(this.rechercheMedicament)) {
      this.medicamentsAjoutes.push(this.rechercheMedicament);
      this.prescription.medicaments = [...this.medicamentsAjoutes];
      this.rechercheMedicament = '';
    }
  }

  retirerMedicament(medicament: string) {
    this.medicamentsAjoutes = this.medicamentsAjoutes.filter(m => m !== medicament);
    this.prescription.medicaments = [...this.medicamentsAjoutes];
  }

  genererPDF() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${this.apiUrl}/medecin/prescription`, this.prescription, { headers }).subscribe({
      next: () => alert('Prescription enregistrée et générée en PDF !'),
      error: (err) => console.error('Erreur prescription:', err)
    });
  }
}
