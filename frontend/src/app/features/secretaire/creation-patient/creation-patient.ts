import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretaireService } from '../../../core/services/secretaire';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  adresse: string;
  numeroSecurite: string;
}

@Component({
  selector: 'app-creation-patient',
  imports: [RouterLink, FormsModule],
  templateUrl: './creation-patient.html',
  styleUrl: './creation-patient.css',
})
export class CreationPatient implements OnInit {
  private secretaireService = inject(SecretaireService);

  patients = signal<Patient[]>([]);

  nouveauPatient = {
    nom: '', prenom: '', dateNaissance: '',
    telephone: '', email: '', adresse: '', numeroSecurite: ''
  };

  afficherFormulaire = signal(false);
  messageSucces = signal('');
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit() {
    this.chargerPatients();
  }

  chargerPatients() {
    this.secretaireService.listerPatients().subscribe({
      next: (data) => this.patients.set(data),
      error: () => this.messageErreur.set('Erreur lors du chargement des patients')
    });
  }

  ajouterPatient(): void {
    if (this.nouveauPatient.nom && this.nouveauPatient.prenom && this.nouveauPatient.telephone) {
      this.chargement.set(true);
      const data = {
        nom: this.nouveauPatient.nom,
        prenom: this.nouveauPatient.prenom,
        email: this.nouveauPatient.email,
        password: '12345678',
        role: 'patient',
        telephone: this.nouveauPatient.telephone,
        adresse: this.nouveauPatient.adresse,
        dateNaissance: this.nouveauPatient.dateNaissance,
        numeroSecurite: this.nouveauPatient.numeroSecurite
      };

      this.secretaireService.creerPatient(data).subscribe({
        next: () => {
          this.messageSucces.set(`✅ Patient ${this.nouveauPatient.prenom} ${this.nouveauPatient.nom} créé !`);
          this.nouveauPatient = { nom: '', prenom: '', dateNaissance: '', telephone: '', email: '', adresse: '', numeroSecurite: '' };
          this.afficherFormulaire.set(false);
          this.chargement.set(false);
          this.chargerPatients();
          setTimeout(() => this.messageSucces.set(''), 3000);
        },
        error: (err) => {
          this.messageErreur.set(err.error?.message || 'Erreur lors de la création');
          this.chargement.set(false);
        }
      });
    }
  }
}