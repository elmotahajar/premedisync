import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  section?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;

  navItems: NavItem[] = [
    // ACCUEIL
    { section: 'ACCUEIL', label: 'Dashboard', route: '/admin/accueil', icon: '🏠' },

    // GESTION
    { section: 'GESTION', label: 'Patients', route: '/admin/patients', icon: '🧑‍⚕️' },
    { label: 'Médecins', route: '/admin/medecins', icon: '👨‍⚕️' },
    { label: 'Secrétaires', route: '/admin/secretaires', icon: '👩‍💼' },
    { label: 'Rendez-vous', route: '/admin/rdv', icon: '📅' },

    // ADMINISTRATION
    { section: 'ADMINISTRATION', label: 'Facturation', route: '/admin/facturation', icon: '💰' },
    { label: 'Établissement', route: '/admin/etablissement', icon: '🏥' },
    { label: 'Salles', route: '/admin/salles', icon: '🚪' },
    { label: 'Audit Logs', route: '/admin/audit-logs', icon: '📜' },
    { label: 'Paramètres', route: '/admin/settings', icon: '⚙️' },
  ];

  getSections(): string[] {
    return [...new Set(this.navItems.map(item => item.section).filter((s): s is string => !!s))];
  }

  getItemsBySection(section: string): NavItem[] {
    return this.navItems.filter(item => item.section === section);
  }

  getUngroupedItems(): NavItem[] {
    return this.navItems.filter(item => !item.section && !this.navItems.find(i => i.section === item.label));
  }
}
