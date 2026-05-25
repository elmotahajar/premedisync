import { Component, inject, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface ChartData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-medecin-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medecin-accueil.html',
  styleUrls: ['./medecin-accueil.css']
})
export class MedecinAccueilComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(true);
  medecin = signal<any>({});
  rendezVousAujourdhui = signal<any[]>([]);

  // KPIs
  rdvAujourdhuiCount = signal<number>(0);
  totalPatients = signal<number>(142);
  consultationsMois = signal<number>(58);
  prochainRdv = signal<any>(null);

  // Chart
  consultationsChartData: ChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    values: [8, 12, 10, 15, 14, 6, 0]
  };

  private apiUrl = 'http://localhost:3000/api';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    forkJoin({
      profil: this.http.get(`${this.apiUrl}/medecin/profil`, { headers }),
      rdvsJour: this.http.get(`${this.apiUrl}/medecin/patients-jour`, { headers })
    }).subscribe({
      next: (res: any) => {
        this.medecin.set(res.profil);
        const rdvs = Array.isArray(res.rdvsJour) ? res.rdvsJour : [];
        this.rendezVousAujourdhui.set(rdvs);
        this.rdvAujourdhuiCount.set(rdvs.length);

        // Find next appointment today
        const now = new Date();
        const futureToday = rdvs
          .filter((r: any) => new Date(r.dateHeure) > now && r.statut !== 'Annulé')
          .sort((a: any, b: any) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
        
        if (futureToday.length > 0) {
          this.prochainRdv.set(futureToday[0]);
        } else if (rdvs.length > 0) {
          this.prochainRdv.set(rdvs[0]); // default to first today
        }

        this.loading.set(false);
        setTimeout(() => this.drawChart(), 100);
      },
      error: (err) => {
        console.error('Erreur chargement donnees accueil medecin:', err);
        this.medecin.set({ nom: 'Médecin', specialite: 'Généraliste' });
        this.loading.set(false);
        setTimeout(() => this.drawChart(), 100);
      }
    });
  }

  ngAfterViewInit() {
    if (!this.loading()) {
      this.drawChart();
    }
  }

  consulter(id: number) {
    this.router.navigate([`/medecin/consultation/${id}`]);
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'confirmé' || s === 'confirme' || s === 'confirmed' || s === 'success') {
      return '#10b981';
    }
    if (s === 'en attente' || s === 'pending' || s === 'warning') {
      return '#f59e0b';
    }
    if (s === 'annulé' || s === 'annule' || s === 'cancelled' || s === 'danger') {
      return '#ef4444';
    }
    return '#0ea5e9';
  }

  drawChart() {
    const canvas = document.getElementById('consultationsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxValue = Math.max(...this.consultationsChartData.values) || 10;
    const barWidth = graphWidth / (this.consultationsChartData.values.length * 1.5);

    ctx.fillStyle = '#1e293b'; // Card Bg
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    const colors = ['#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9'];
    for (let i = 0; i < this.consultationsChartData.values.length; i++) {
      const x = padding + (i + 0.25) * (barWidth * 1.5);
      const val = this.consultationsChartData.values[i];
      const barHeight = val > 0 ? (val / maxValue) * graphHeight : 0;
      const y = height - padding - barHeight;

      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label value
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (val > 0) {
        ctx.fillText(val.toString(), x + barWidth / 2, y - 5);
      }

      // X Label
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(this.consultationsChartData.labels[i], x + barWidth / 2, height - padding + 20);
    }
  }
}
