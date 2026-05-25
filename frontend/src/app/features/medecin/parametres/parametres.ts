import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medecin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="parametres-container" style="max-width: 600px;">
      <h2 style="margin-bottom: 24px;">Paramètres du compte</h2>
      
      <div class="card" style="padding: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 18px; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
          Informations du praticien
        </h3>
        
        <form (ngSubmit)="save()" style="display: flex; flex-direction: column; gap: 16px;">
          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Nom complet</label>
            <input type="text" class="admin-input" [(ngModel)]="medecin.nom" name="nom" readonly />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Spécialité</label>
            <input type="text" class="admin-input" [(ngModel)]="medecin.specialite" name="specialite" readonly />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Adresse Email</label>
            <input type="email" class="admin-input" [(ngModel)]="medecin.email" name="email" />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Téléphone professionnel</label>
            <input type="text" class="admin-input" [(ngModel)]="medecin.telephone" name="telephone" />
          </div>

          <div style="margin-top: 12px;">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Enregistrer les modifications</button>
          </div>
        </form>
        
        @if (message()) {
          <div style="margin-top: 16px; color: var(--success); text-align: center; font-weight: 600;">
            {{ message() }}
          </div>
        }
      </div>
    </div>
  `
})
export class MedecinParametresComponent implements OnInit {
  private http = inject(HttpClient);
  medecin: any = { nom: '', specialite: '', email: 'medecin@medisync.fr', telephone: '0699887766' };
  message = signal('');

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get('http://localhost:3000/api/medecin/profil', { headers }).subscribe({
      next: (data: any) => {
        if (data) {
          this.medecin = { ...this.medecin, ...data };
        }
      }
    });
  }

  save() {
    this.message.set('Paramètres enregistrés avec succès !');
    setTimeout(() => this.message.set(''), 3000);
  }
}
