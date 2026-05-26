import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.html',
  styleUrls: ['./historique.css']
})
export class Historique implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  historique = signal<any[]>([]);
  allergies = signal<string>('');
  antecedents = signal<string>('');
  documents = signal<any[]>([]);
  
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  messageSucces = signal<string>('');
  messageErreur = signal<string>('');
  uploading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDossierData();
  }

  loadDossierData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      dossierObj: this.patientService.getDossier(),
      historiqueList: this.patientService.getHistorique()
    }).subscribe({
      next: (res: any) => {
        const d = res.dossierObj?.dossier || {};
        this.allergies.set(d.allergies || 'Aucune allergie signalée');
        this.antecedents.set(d.antecedents || 'Aucun antécédent médical renseigné');
        this.documents.set(d.documents || []);
        
        this.historique.set(res.historiqueList || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement dossier complet:', err);
        this.error.set('Impossible de charger votre dossier médical.');
        this.loading.set(false);
      }
    });
  }

  onFichierSelectionne(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const fichier = input.files[0];
    const typesAcceptes = ['application/pdf', 'image/jpeg', 'image/png'];
    const tailleMax = 20 * 1024 * 1024; // 20Mo

    this.messageErreur.set('');
    this.messageSucces.set('');

    if (!typesAcceptes.includes(fichier.type)) {
      this.messageErreur.set('Format non accepté. Utilisez PDF, JPG ou PNG.');
      return;
    }

    if (fichier.size > tailleMax) {
      this.messageErreur.set('Fichier trop volumineux. Maximum 20 Mo.');
      return;
    }

    this.uploading.set(true);

    this.patientService.uploadDocument(fichier).subscribe({
      next: (response) => {
        this.messageSucces.set(`"${fichier.name}" téléversé avec succès !`);
        this.uploading.set(false);
        // Refresh dossier to load newly added document
        this.loadDossierData();
        setTimeout(() => this.messageSucces.set(''), 4000);
        input.value = '';
      },
      error: (err) => {
        this.messageErreur.set('Erreur lors du téléversement du document.');
        this.uploading.set(false);
        console.error(err);
      }
    });
  }

  voirDetails(id: number): void {
    this.router.navigate([`/patient/dossier/${id}`]);
  }

  retour(): void {
    this.router.navigate(['/patient/dashboard']);
  }
}