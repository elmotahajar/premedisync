import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Consultation {
  id: number;
  date: string;
  medecin: string;
  specialite: string;
  motif: string;
  compteRendu: string;
  ordonnanceUrl?: string;
}

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultations.html',
  styleUrls: ['./consultations.css']
})
export class Consultations {
  private router = inject(Router);

  // Données mockées (à remplacer par appel API plus tard)
  consultations: Consultation[] = [
    {
      id: 1,
      date: '2026-05-15',
      medecin: 'Dr. Martin Dupont',
      specialite: 'Médecine générale',
      motif: 'Consultation générale',
      compteRendu: 'Patient en bonne santé. Prescription de vitamines pour 1 mois.',
      ordonnanceUrl: '/ordonnances/1'
    },
    {
      id: 2,
      date: '2026-04-10',
      medecin: 'Dr. Sophie Bernard',
      specialite: 'Cardiologie',
      motif: 'Suivi cardiaque',
      compteRendu: 'Tension normale. Bilan sanguin à refaire dans 3 mois.',
      ordonnanceUrl: '/ordonnances/2'
    },
    {
      id: 3,
      date: '2026-03-22',
      medecin: 'Dr. Jean Petit',
      specialite: 'Dermatologie',
      motif: 'Éruption cutanée',
      compteRendu: 'Allergie détectée. Prescription d\'antihistaminiques.',
      ordonnanceUrl: '/ordonnances/3'
    }
  ];

  consultationSelectionnee: Consultation | null = null;

  voirDetails(consultation: Consultation): void {
    this.consultationSelectionnee = this.consultationSelectionnee === consultation ? null : consultation;
  }

  telechargerOrdonnance(consultation: Consultation): void {
    // À connecter avec le back-end plus tard
    alert(`Téléchargement de l'ordonnance du ${consultation.date}`);
  }
  getMois(dateString: string): string {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const date = new Date(dateString);
    return mois[date.getMonth()];
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}