import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Salle {
  id: number;
  nom: string;
  type: string;
  capacite: number;
  equipements: string;
  disponible: boolean;
}

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salles.html',
  styleUrls: ['./salles.css']
})
export class Salles {
  constructor(private router: Router) {}

  salles: Salle[] = [
    { id: 1, nom: 'Salle 101', type: 'Consultation', capacite: 1, equipements: 'Bureau, lit d\'examen', disponible: true },
    { id: 2, nom: 'Salle 102', type: 'Consultation', capacite: 1, equipements: 'Bureau, lit d\'examen', disponible: true },
    { id: 3, nom: 'Salle 103', type: 'Urgences', capacite: 2, equipements: 'Équipement médical complet', disponible: true },
    { id: 4, nom: 'Salle 104', type: 'Réunion', capacite: 10, equipements: 'Tableau, vidéoprojecteur', disponible: false }
  ];

  typesSalle = ['Consultation', 'Urgences', 'Réunion', 'Soins', 'Examen'];

  showModal = false;
  editMode = false;
  currentSalle: Salle = this.getEmptySalle();
  message = '';

  getEmptySalle(): Salle {
    return { id: 0, nom: '', type: '', capacite: 1, equipements: '', disponible: true };
  }

  ajouter() {
    this.editMode = false;
    this.currentSalle = this.getEmptySalle();
    this.showModal = true;
  }

  modifier(salle: Salle) {
    this.editMode = true;
    this.currentSalle = { ...salle };
    this.showModal = true;
  }

  supprimer(id: number) {
    if (confirm('Supprimer cette salle ?')) {
      this.salles = this.salles.filter(s => s.id !== id);
      this.message = 'Salle supprimée';
      setTimeout(() => this.message = '', 2000);
    }
  }

  toggleDisponible(salle: Salle) {
    salle.disponible = !salle.disponible;
    this.message = `Salle ${salle.disponible ? 'disponible' : 'indisponible'}`;
    setTimeout(() => this.message = '', 2000);
  }

  sauvegarder() {
    if (!this.currentSalle.nom || !this.currentSalle.type) {
      this.message = 'Veuillez remplir tous les champs';
      setTimeout(() => this.message = '', 2000);
      return;
    }

    if (this.editMode) {
      const index = this.salles.findIndex(s => s.id === this.currentSalle.id);
      if (index !== -1) this.salles[index] = this.currentSalle;
      this.message = 'Salle modifiée';
    } else {
      const newId = Math.max(...this.salles.map(s => s.id), 0) + 1;
      this.currentSalle.id = newId;
      this.salles.push({ ...this.currentSalle });
      this.message = 'Salle ajoutée';
    }

    this.showModal = false;
    setTimeout(() => this.message = '', 2000);
  }

  fermerModal() {
    this.showModal = false;
  }

  retour() {
    this.router.navigate(['/admin/dashboard']);
  }
}