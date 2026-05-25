import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Consultation {
  id: number;
  date: string;
  medecin: string;
  specialite: string;
  motif: string;
  diagnostic: string;
  compteRendu: string;
  medicaments: string[];
}

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  private route = inject(ActivatedRoute);

  consultations: Consultation[] = [
    { id: 1, date: '2026-04-15', medecin: 'Dr. Benali', specialite: 'Généraliste', motif: 'Consultation générale', diagnostic: 'Grippe saisonnière', compteRendu: 'Patient présentant fièvre et toux. Repos recommandé pendant 5 jours.', medicaments: ['Paracétamol 1g', 'Sirop pour la toux'] },
    { id: 2, date: '2026-03-10', medecin: 'Dr. Alaoui', specialite: 'Cardiologue', motif: 'Suivi', diagnostic: 'Tension artérielle stable', compteRendu: 'Tension 12/8. Bilan satisfaisant. Prochain suivi dans 6 mois.', medicaments: ['Amlodipine 5mg'] },
    { id: 3, date: '2026-02-20', medecin: 'Dr. Idrissi', specialite: 'Pédiatre', motif: 'Urgence', diagnostic: 'Angine bactérienne', compteRendu: 'Gorge très inflammée. Antibiothérapie prescrite pour 7 jours.', medicaments: ['Amoxicilline 500mg', 'Ibuprofène 400mg'] },
  ];

  consultation = signal<Consultation | undefined>(undefined);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.consultations.find(c => c.id === id);
    this.consultation.set(found);
  }
}