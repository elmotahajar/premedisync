import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {
  private router = inject(Router);
  private patientService = inject(PatientService);

  documents: any[] = [];
  messageSucces = '';
  messageErreur = '';

  onFichierSelectionne(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const fichier = input.files[0];
    const typesAcceptes = ['application/pdf', 'image/jpeg', 'image/png'];
    const tailleMax = 20 * 1024 * 1024;

    if (!typesAcceptes.includes(fichier.type)) {
      this.messageErreur = 'Format non accepté. Utilisez PDF, JPG ou PNG.';
      return;
    }

    if (fichier.size > tailleMax) {
      this.messageErreur = 'Fichier trop volumineux. Maximum 20 Mo.';
      return;
    }

    this.patientService.uploadDocument(fichier).subscribe({
      next: (response) => {
        this.messageSucces = `"${fichier.name}" téléversé avec succès !`;
        setTimeout(() => this.messageSucces = '', 3000);
        input.value = '';
      },
      error: (err) => {
        this.messageErreur = 'Erreur lors du téléversement';
        console.error(err);
      }
    });
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}  