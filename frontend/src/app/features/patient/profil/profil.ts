import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class Profil implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal('');

  form = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: ''
  };

  ngOnInit(): void {
    this.loadProfil();
  }

  loadProfil(): void {
    this.loading.set(true);
    this.error.set(null);
    this.patientService.getProfil().subscribe({
      next: (data: any) => {
        this.form = {
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          dateNaissance: data.dateNaissance ? data.dateNaissance.split('T')[0] : '',
          adresse: data.adresse || ''
        };
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        this.error.set('Impossible de charger votre profil.');
        this.loading.set(false);
      }
    });
  }

  soumettre(): void {
    if (!this.form.nom || !this.form.prenom || !this.form.email) {
      this.error.set('Nom, prénom et email sont obligatoires.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.patientService.updateProfil(this.form).subscribe({
      next: () => {
        this.successMessage.set('Profil mis à jour avec succès !');
        this.saving.set(false);
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: (err) => {
        console.error('Erreur mise à jour profil:', err);
        this.error.set('Erreur lors de la sauvegarde. Veuillez réessayer.');
        this.saving.set(false);
      }
    });
  }

  retour(): void {
    this.router.navigate(['/patient/accueil']);
  }
}