import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etablissement.html',
  styleUrls: ['./etablissement.css']
})
export class Etablissement {
  constructor(private router: Router) {}

  clinique = {
    nom: 'MediSync Clinique',
    adresse: '123 Avenue de la Santé, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@medisync.fr',
    horaires: 'Lundi - Vendredi: 8h00 - 20h00, Samedi: 9h00 - 17h00',
    presentation: 'Clinique moderne dédiée aux soins de qualité avec une équipe de médecins expérimentés.'
  };

  specialites: string[] = [
    'Médecine générale',
    'Cardiologie',
    'Dermatologie',
    'Pédiatrie',
    'Gynécologie'
  ];

  nouvelleSpecialite = '';
  message = '';

  ajouterSpecialite() {
    if (this.nouvelleSpecialite.trim()) {
      this.specialites.push(this.nouvelleSpecialite);
      this.nouvelleSpecialite = '';
      this.message = 'Spécialité ajoutée';
      setTimeout(() => this.message = '', 2000);
    }
  }

  supprimerSpecialite(index: number) {
    this.specialites.splice(index, 1);
    this.message = 'Spécialité supprimée';
    setTimeout(() => this.message = '', 2000);
  }

  sauvegarder() {
    this.message = 'Informations sauvegardées !';
    setTimeout(() => this.message = '', 2000);
  }

  retour() {
    this.router.navigate(['/admin/dashboard']);
  }
}