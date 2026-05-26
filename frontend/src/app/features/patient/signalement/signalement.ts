import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-signalement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signalement.html',
  styleUrls: ['./signalement.css']
})
export class Signalement implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  feedbacks = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Avis form
  avis = { note: 5, commentaire: '' };
  submittingAvis = signal(false);
  messageAvisSucces = signal('');
  messageAvisErreur = signal('');

  // Signalement form
  signalement = { type: '', description: '', urgence: 'normale' };
  submittingSig = signal(false);
  messageSigSucces = signal('');
  messageSigErreur = signal('');

  typesSignalement = [
    'Problème technique',
    'Problème de rendez-vous',
    'Problème de facturation',
    'Accès aux documents',
    'Autre'
  ];

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.loading.set(true);
    this.error.set(null);
    this.patientService.getAvis().subscribe({
      next: (data) => {
        this.feedbacks.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement avis:', err);
        this.error.set('Impossible de charger les avis.');
        this.loading.set(false);
      }
    });
  }

  submitAvis() {
    this.messageAvisSucces.set('');
    this.messageAvisErreur.set('');

    if (!this.avis.commentaire.trim()) {
      this.messageAvisErreur.set('Veuillez saisir un commentaire.');
      return;
    }

    this.submittingAvis.set(true);
    this.patientService.postAvis({ note: this.avis.note, commentaire: this.avis.commentaire }).subscribe({
      next: () => {
        this.messageAvisSucces.set('Votre avis a été publié avec succès !');
        this.avis = { note: 5, commentaire: '' };
        this.submittingAvis.set(false);
        this.loadFeedbacks();
        setTimeout(() => this.messageAvisSucces.set(''), 4000);
      },
      error: (err) => {
        console.error(err);
        this.messageAvisErreur.set('Erreur lors de la publication de votre avis.');
        this.submittingAvis.set(false);
      }
    });
  }

  submitSignalement() {
    this.messageSigSucces.set('');
    this.messageSigErreur.set('');

    if (!this.signalement.type || !this.signalement.description) {
      this.messageSigErreur.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.signalement.description.trim().length < 10) {
      this.messageSigErreur.set('La description doit contenir au moins 10 caractères.');
      return;
    }

    this.submittingSig.set(true);
    this.patientService.postSignalement(this.signalement).subscribe({
      next: () => {
        this.messageSigSucces.set('Votre signalement a été enregistré avec succès.');
        this.signalement = { type: '', description: '', urgence: 'normale' };
        this.submittingSig.set(false);
        setTimeout(() => this.messageSigSucces.set(''), 4000);
      },
      error: (err) => {
        console.error(err);
        this.messageSigErreur.set('Erreur lors de l\'envoi du signalement.');
        this.submittingSig.set(false);
      }
    });
  }

  starsArray(n: number): string[] {
    return Array(5).fill('').map((_, i) => i < n ? '★' : '☆');
  }

  retour() {
    this.router.navigate(['/patient/accueil']);
  }
}