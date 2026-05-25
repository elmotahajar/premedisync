import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Log {
  id: number;
  date: string;
  heure: string;
  utilisateur: string;
  role: string;
  action: string;
  details: string;
  ip: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css']
})
export class AuditLogs {
  constructor(private router: Router) {}

  logs: Log[] = [
    { id: 1, date: '2026-05-23', heure: '08:15', utilisateur: 'Dr. Martin Dupont', role: 'medecin', action: 'Consultation dossier', details: 'Accès au dossier de patient Jean Dupont', ip: '192.168.1.1' },
    { id: 2, date: '2026-05-23', heure: '09:30', utilisateur: 'Marie Dubois', role: 'secretaire', action: 'Création rendez-vous', details: 'RDV créé pour Sophie Bernard avec Dr. Petit', ip: '192.168.1.2' },
    { id: 3, date: '2026-05-22', heure: '14:20', utilisateur: 'Admin Système', role: 'admin', action: 'Modification utilisateur', details: 'Ajout du médecin Dr. Claire Martin', ip: '192.168.1.5' },
    { id: 4, date: '2026-05-22', heure: '11:05', utilisateur: 'Dr. Sophie Bernard', role: 'medecin', action: 'Prescription', details: 'Prescription électronique émise pour patient Lucas Martin', ip: '192.168.1.3' },
    { id: 5, date: '2026-05-21', heure: '16:45', utilisateur: 'Julie Martin', role: 'secretaire', action: 'Facturation', details: 'Génération facture #12345 pour consultation', ip: '192.168.1.4' },
    { id: 6, date: '2026-05-21', heure: '09:00', utilisateur: 'Admin Système', role: 'admin', action: 'Connexion', details: 'Connexion depuis un nouvel appareil', ip: '192.168.1.5' }
  ];

  filtreAction: string = 'toutes';
  filtreRole: string = 'tous';
  searchText: string = '';
  dateDebut = '';
  dateFin = '';

  actions = ['toutes', 'Connexion', 'Consultation dossier', 'Création rendez-vous', 'Modification utilisateur', 'Prescription', 'Facturation'];
  roles = ['tous', 'admin', 'medecin', 'secretaire', 'patient'];

  get logsFiltres() {
    let result = this.logs;

    if (this.filtreAction !== 'toutes') {
      result = result.filter(l => l.action === this.filtreAction);
    }

    if (this.filtreRole !== 'tous') {
      result = result.filter(l => l.role === this.filtreRole);
    }

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      result = result.filter(l => 
        l.utilisateur.toLowerCase().includes(search) ||
        l.details.toLowerCase().includes(search) ||
        l.action.toLowerCase().includes(search)
      );
    }

    if (this.dateDebut) {
      result = result.filter(l => l.date >= this.dateDebut);
    }

    if (this.dateFin) {
      result = result.filter(l => l.date <= this.dateFin);
    }

    return result;
  }

  getRoleClass(role: string): string {
    switch(role) {
      case 'admin': return 'badge admin';
      case 'medecin': return 'badge medecin';
      case 'secretaire': return 'badge secretaire';
      default: return 'badge';
    }
  }

  getRoleTexte(role: string): string {
    switch(role) {
      case 'admin': return 'Admin';
      case 'medecin': return 'Médecin';
      case 'secretaire': return 'Secrétaire';
      default: return role;
    }
  }

  retour() {
    this.router.navigate(['/admin/accueil']);
  }

  exportCsv() {
    const header = ['Date', 'Heure', 'Utilisateur', 'Role', 'Action', 'Details', 'IP'];
    const rows = this.logsFiltres.map(log => [log.date, log.heure, log.utilisateur, log.role, log.action, log.details, log.ip]);
    const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}