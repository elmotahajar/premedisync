import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RdvService } from '../../../core/services/rdv.service';

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-rdv.html',
  styleUrls: ['./mes-rdv.css']
})
export class MesRdv implements OnInit {
  private router = inject(Router);
  private rdvService = inject(RdvService);

  rendezVous: any[] = [];
  loading: boolean = true;
  message: string = '';

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.rdvService.getAll().subscribe({
      next: (data) => {
        this.rendezVous = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement RDV:', err);
        this.loading = false;
      }
    });
  }

  annulerRdv(id: number): void {
    if (confirm('Annuler ce rendez-vous ?')) {
      this.rdvService.delete(id).subscribe({
        next: () => {
          this.message = 'Rendez-vous annulé';
          this.loadRendezVous();
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => console.error('Erreur annulation:', err)
      });
    }
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}