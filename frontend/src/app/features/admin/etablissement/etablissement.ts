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
    adresse: '123 Avenue de la Santé',
    ville: 'Paris',
    codePostal: '75001',
    telephone: '01 23 45 67 89',
    email: 'contact@medisync.fr',
    siteWeb: 'https://medisync.fr'
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
  logoPreview = '';
  coverPreview = '';

  horaires = [
    { jour: 'Lundi', ouvert: true, debut: '08:00', fin: '18:00' },
    { jour: 'Mardi', ouvert: true, debut: '08:00', fin: '18:00' },
    { jour: 'Mercredi', ouvert: true, debut: '08:00', fin: '18:00' },
    { jour: 'Jeudi', ouvert: true, debut: '08:00', fin: '18:00' },
    { jour: 'Vendredi', ouvert: true, debut: '08:00', fin: '18:00' },
    { jour: 'Samedi', ouvert: true, debut: '09:00', fin: '13:00' },
    { jour: 'Dimanche', ouvert: false, debut: '00:00', fin: '00:00' }
  ];

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

  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.logoPreview = String(reader.result || '');
    reader.readAsDataURL(file);
  }

  onCoverUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = String(reader.result || '');
    reader.readAsDataURL(file);
  }

  sauvegarder() {
    this.message = 'Informations sauvegardées !';
    setTimeout(() => this.message = '', 2000);
  }

  retour() {
    this.router.navigate(['/admin/accueil']);
  }
}