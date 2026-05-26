import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste.html',
  styleUrls: ['./liste.css']
})
export class Liste implements OnInit {
  private router = inject(Router);
  private patientService = inject(PatientService);

  ordonnances = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrdonnances();
  }

  loadOrdonnances(): void {
    this.loading.set(true);
    this.error.set(null);

    this.patientService.getOrdonnances().subscribe({
      next: (data) => {
        this.ordonnances.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement ordonnances:', err);
        this.error.set('Impossible de charger vos ordonnances.');
        this.loading.set(false);
      }
    });
  }

  telechargerPdf(ord: any): void {
    const docHtml = `
      <html>
      <head>
        <title>Ordonnance - ${ord.medecin}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
          .medecin { font-size: 22px; font-weight: bold; color: #0ea5e9; }
          .date { text-align: right; color: #64748b; font-size: 14px; margin-top: -24px; }
          .title { text-align: center; font-size: 26px; margin: 40px 0; text-transform: uppercase; letter-spacing: 2px; color: #0f172a; font-weight: 800; }
          .content { font-size: 16px; background: #f0f9ff; padding: 25px; border-radius: 8px; border: 1px solid #e0f2fe; }
          .info-row { margin-bottom: 12px; }
          .label { font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; }
          .footer { margin-top: 60px; text-align: right; font-style: italic; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="medecin">${ord.medecin}</div>
          <div class="date">Émise le : ${new Date(ord.date).toLocaleDateString('fr-FR')}</div>
        </div>
        <div class="title">Ordonnance Médicale</div>
        <div class="content">
          <div class="info-row"><span class="label">Médicaments :</span><br>${(ord.medicaments || '').split(', ').map((m: string) => `• ${m}`).join('<br>')}</div>
          <div class="info-row"><span class="label">Posologie :</span><br>${ord.posologie || 'Voir instructions'}</div>
          <div class="info-row"><span class="label">Durée :</span><br>${ord.duree || 'Non précisée'}</div>
          <div class="info-row"><span class="label">Statut :</span> ${ord.statut}</div>
        </div>
        <div class="footer">Signature électronique certifiée<br>MediSync — Cabinet Médical Connecté</div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    const blob = new Blob([docHtml], { type: 'text/html' });
    window.open(URL.createObjectURL(blob));
  }

  retour(): void {
    this.router.navigate(['/patient/accueil']);
  }
}