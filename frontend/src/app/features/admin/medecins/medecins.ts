import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LucideEye, LucidePencil, LucideTrash2 } from '@lucide/angular';

interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  specialite?: string;
  email: string;
  telephone?: string;
  tarif?: number;
  role: string;
  actif?: boolean;
}

@Component({
  selector: 'app-medecins',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideEye, LucidePencil, LucideTrash2],
  templateUrl: './medecins.html',
  styleUrls: ['./medecins.css']
})
export class Medecins implements OnInit {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  medecins: Medecin[] = [];
  specialites = ['Médecine générale', 'Cardiologie', 'Dermatologie', 'Pédiatrie', 'Gynécologie', 'Ophtalmologie'];
  showModal = false;
  editMode = false;
  currentMedecin: any = this.getEmptyMedecin();
  message = '';

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit() {
    this.chargerMedecins();
  }

  chargerMedecins() {
    this.http.get<any>(`${this.apiUrl}/personnel`, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.medecins = res.personnel.filter((p: any) => p.role === 'medecin');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement médecins:', err)
    });
  }

  getEmptyMedecin() {
    return { nom: '', prenom: '', specialite: '', email: '', telephone: '', password: '', role: 'medecin', actif: true };
  }

  ajouter() {
    this.editMode = false;
    this.currentMedecin = this.getEmptyMedecin();
    this.showModal = true;
  }

  modifier(medecin: Medecin) {
    this.editMode = true;
    this.currentMedecin = { ...medecin };
    this.showModal = true;
  }

  supprimer(id: number) {
    if (confirm('Supprimer ce médecin ?')) {
      this.http.delete(`${this.apiUrl}/personnel/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.medecins = this.medecins.filter(m => m.id !== id);
          this.cdr.detectChanges();
          this.message = 'Médecin supprimé';
          setTimeout(() => this.message = '', 2000);
        }
      });
    }
  }

  toggleActif(medecin: Medecin) {
    medecin.actif = !medecin.actif;
    this.message = `Médecin ${medecin.actif ? 'activé' : 'désactivé'}`;
    setTimeout(() => this.message = '', 2000);
  }

  sauvegarder() {
    if (!this.currentMedecin.nom || !this.currentMedecin.prenom) {
      this.message = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.editMode) {
      this.http.put(`${this.apiUrl}/personnel/${this.currentMedecin.id}`, this.currentMedecin, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.chargerMedecins();
          this.message = 'Médecin modifié';
          this.showModal = false;
          setTimeout(() => this.message = '', 2000);
        }
      });
    } else {
      this.http.post(`${this.apiUrl}/personnel`, { ...this.currentMedecin, role: 'medecin' }, { headers: this.getHeaders() }).subscribe({
        next: (res: any) => {
          this.chargerMedecins();
          this.message = res.message || 'Médecin ajouté';
          this.showModal = false;
          this.currentMedecin = this.getEmptyMedecin();
          this.cdr.detectChanges();
          setTimeout(() => this.message = '', 3000);
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
    this.currentMedecin = this.getEmptyMedecin();
  }

  retour() {
    this.router.navigate(['/admin/accueil']);
  }
}