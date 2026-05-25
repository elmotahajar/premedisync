import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  constructor(private router: Router) {}

  activeTab = signal<'account' | 'security' | 'notifications' | 'appearance'>('account');
  message = signal('');

  admin = {
    nom: 'Admin MediSync',
    email: 'admin@medisync.fr',
    password: ''
  };

  security = {
    twoFa: true,
    sessionTimeout: '30',
    qrVisible: true
  };

  notifications = {
    emailRappels: true,
    alertesImpayes: true,
    rapportJournalier: false
  };

  appearance = {
    theme: 'dark',
    language: 'fr'
  };

  setTab(tab: 'account' | 'security' | 'notifications' | 'appearance') {
    this.activeTab.set(tab);
  }

  save(section: string) {
    this.message.set(`${section} enregistré avec succès`);
    setTimeout(() => this.message.set(''), 2000);
  }

  toggleTwoFa() {
    this.security.twoFa = !this.security.twoFa;
    this.security.qrVisible = this.security.twoFa;
    this.save('Sécurité');
  }

  retour() {
    this.router.navigate(['/admin/accueil']);
  }
}
