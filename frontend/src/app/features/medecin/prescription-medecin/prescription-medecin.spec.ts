import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prescription-medecin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prescription-medecin.html',
  styleUrls: ['./prescription-medecin.css']
})
export class PrescriptionMedecin {
  patients = [
    { id: 1, nom: 'Sophie Durand', age: 36 },
    { id: 2, nom: 'Jean Martin', age: 52 },
    { id: 3, nom: 'Marie Lambert', age: 28 },
    { id: 4, nom: 'Thomas Bernard', age: 45 },
    { id: 5, nom: 'Claire Petit', age: 31 }
  ];

  patientSelectionne: any = null;
  rechercheMedicament = '';
  medicamentsDisponibles = [
    'Paracétamol 500mg',
    'Ibuprofène 400mg',
    'Amoxicilline 1g',
    'Ventoline 100mcg',
    'Lisinopril 10mg',
    'Aspirine 100mg'
  ];
  medicamentsAjoutes: string[] = [];
  prescription = {
    patientId: null,
    medicaments: [] as string[],
    duree: '7',
    posologie: '',
    remarques: ''
  };

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
    alert('Prescription générée en PDF !');
    console.log('Prescription:', this.prescription);
  }
}
