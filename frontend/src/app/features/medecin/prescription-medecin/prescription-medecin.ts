import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Medicament {
  nom: string;
  posologie: string;
  duree: string;
  instructions: string;
}

@Component({
  selector: 'app-prescription-medecin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prescription-medecin.html',
  styleUrls: ['./prescription-medecin.css']
})
export class PrescriptionMedecin implements OnInit {
  // Profil médecin
  medecinNom = 'Médecin';
  medecinId: string | null = null;

  // Patients
  patients: any[] = [];
  patientSelectionne: any = null;

  // Médicaments
  medicamentsAjoutes: Medicament[] = [];
  medicamentForm = {
    nom: '',
    posologie: '',
    duree: '7',
    instructions: ''
  };

  // États
  chargementPatients = false;
  creationEnCours = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerProfilMedecin();
  }

  /**
   * Charge le profil du médecin connecté
   */
  chargerProfilMedecin() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Décoder le JWT pour récupérer l'ID du médecin
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.medecinId = payload.id || payload.userId;
    } catch (e) {
      console.error('Erreur décodage token:', e);
    }

    // Récupérer le profil complet du médecin
    this.http.get(`${this.apiUrl}/medecin/profil`, { headers }).subscribe({
      next: (data: any) => {
        if (data && data.nom) {
          this.medecinNom = data.nom;
        }
        // Charger les patients après avoir obtenu le profil
        this.chargerPatients();
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        // Charger les patients quand même
        this.chargerPatients();
      }
    });
  }

  /**
   * Charge la liste des patients du médecin connecté
   */
  chargerPatients() {
    if (!this.medecinId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.chargementPatients = true;

    this.http.get(`${this.apiUrl}/medecin/${this.medecinId}/patients`, { headers }).subscribe({
      next: (data: any) => {
        this.patients = Array.isArray(data) ? data : data?.patients || [];
        this.chargementPatients = false;
      },
      error: (err) => {
        console.error('Erreur chargement patients:', err);
        this.chargementPatients = false;
      }
    });
  }

  /**
   * Sélectionne un patient
   */
  selectionnerPatient(patient: any) {
    this.patientSelectionne = patient;
    this.reinitialiserFormulaire();
  }

  /**
   * Ajoute un médicament au formulaire
   */
  ajouterMedicament() {
    if (!this.medicamentForm.nom.trim()) {
      alert('Veuillez entrer un nom de médicament');
      return;
    }

    const medicament: Medicament = {
      nom: this.medicamentForm.nom.trim(),
      posologie: this.medicamentForm.posologie.trim(),
      duree: this.medicamentForm.duree,
      instructions: this.medicamentForm.instructions.trim()
    };

    this.medicamentsAjoutes.push(medicament);

    // Réinitialiser le formulaire
    this.medicamentForm = {
      nom: '',
      posologie: '',
      duree: '7',
      instructions: ''
    };
  }

  /**
   * Retire un médicament de la liste
   */
  retirerMedicament(index: number) {
    this.medicamentsAjoutes.splice(index, 1);
  }

  /**
   * Réinitialise le formulaire de médicament
   */
  reinitialiserFormulaire() {
    this.medicamentsAjoutes = [];
    this.medicamentForm = {
      nom: '',
      posologie: '',
      duree: '7',
      instructions: ''
    };
  }

  /**
   * Crée la prescription
   */
  creerPrescription() {
    if (!this.patientSelectionne) {
      alert('Veuillez sélectionner un patient');
      return;
    }

    if (this.medicamentsAjoutes.length === 0) {
      alert('Veuillez ajouter au moins un médicament');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      patientId: this.patientSelectionne.id,
      medecinId: this.medecinId,
      medicaments: this.medicamentsAjoutes
    };

    this.creationEnCours = true;

    this.http.post(`${this.apiUrl}/prescriptions`, payload, { headers }).subscribe({
      next: (response: any) => {
        alert('Prescription créée avec succès !');
        this.creationEnCours = false;
        this.reinitialiserFormulaire();
        this.patientSelectionne = null;
      },
      error: (err) => {
        console.error('Erreur création prescription:', err);
        alert('Erreur lors de la création de la prescription');
        this.creationEnCours = false;
      }
    });
  }
}
