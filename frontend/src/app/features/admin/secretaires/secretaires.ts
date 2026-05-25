import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Secretaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  actif?: boolean;
}

@Component({
  selector: 'app-secretaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secretaires.html',
  styleUrls: ['./secretaires.css']
})
export class Secretaires implements OnInit {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  secretaires: Secretaire[] = [];
  showModal = false;
  editMode = false;
  currentSecretaire: any = this.getEmptySecretaire();
  message = '';
  tempPassword = '';

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit() {
    this.chargerSecretaires();
  }

  chargerSecretaires() {
    this.http.get<any>(`${this.apiUrl}/personnel`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.secretaires = res.personnel.filter((p: any) => p.role === 'secretaire');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement secrétaires:', err)
    });
  }

  getEmptySecretaire() {
    return { nom: '', prenom: '', email: '', telephone: '', role: 'secretaire', actif: true };
  }

  ajouter() {
    this.editMode = false;
    this.currentSecretaire = this.getEmptySecretaire();
    this.showModal = true;
  }

  modifier(secretaire: Secretaire) {
    this.editMode = true;
    this.currentSecretaire = { ...secretaire };
    this.showModal = true;
  }

  supprimer(id: number) {
    if (confirm('Supprimer cette secrétaire ?')) {
      this.http.delete(`${this.apiUrl}/personnel/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.secretaires = this.secretaires.filter(s => s.id !== id);
          this.cdr.detectChanges();
          this.message = 'Secrétaire supprimée';
          setTimeout(() => this.message = '', 2000);
        }
      });
    }
  }

  toggleActif(secretaire: Secretaire) {
    secretaire.actif = !secretaire.actif;
    this.message = `Secrétaire ${secretaire.actif ? 'activée' : 'désactivée'}`;
    setTimeout(() => this.message = '', 2000);
  }

  sauvegarder() {
    if (!this.currentSecretaire.nom || !this.currentSecretaire.prenom || !this.currentSecretaire.email) {
      this.message = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.editMode) {
      this.http.put(`${this.apiUrl}/personnel/${this.currentSecretaire.id}`, this.currentSecretaire, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.chargerSecretaires();
          this.message = 'Secrétaire modifiée';
          this.showModal = false;
          setTimeout(() => this.message = '', 2000);
        }
      });
    } else {
      this.http.post(`${this.apiUrl}/personnel`, { ...this.currentSecretaire, role: 'secretaire' }, { headers: this.getHeaders() }).subscribe({
        next: (res: any) => {
          this.chargerSecretaires();
          this.tempPassword = res.tempPassword;
          this.showModal = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.message = err.error?.message || 'Erreur lors de l\'ajout';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  fermerModal() {
    this.showModal = false;
  }

  retour() {
    this.router.navigate(['/admin/dashboard']);
  }
}