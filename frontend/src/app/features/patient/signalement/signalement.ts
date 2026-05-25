import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signalement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signalement.html',
  styleUrls: ['./signalement.css']
})
export class Signalement {
  private router = inject(Router);

  signalement = {
    type: '',
    description: '',
    urgence: 'normale'
  };

  messageSucces = '';
  messageErreur = '';

  typesSignalement = [
    'Problème technique',
    'Problème de rendez-vous',
    'Problème de facturation',
    'Accès aux documents',
    'Autre'
  ];

  onSubmit() {
    if (!this.signalement.type || !this.signalement.description) {
      this.messageErreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.signalement.description.length < 10) {
      this.messageErreur = 'La description doit contenir au moins 10 caractères.';
      return;
    }

    // Ici, tu enverras au back-end plus tard
    console.log('Signalement envoyé:', this.signalement);

    this.messageSucces = 'Votre signalement a été envoyé. Nous traiterons votre demande dans les plus brefs délais.';
    this.messageErreur = '';

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      this.signalement = { type: '', description: '', urgence: 'normale' };
      this.messageSucces = '';
    }, 3000);
  }

  retour() {
    this.router.navigate(['/dashboard']);
  }
}