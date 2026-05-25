import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-secretaire-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './secretaire-layout.html',
  styleUrls: ['./secretaire-layout.css']
})
export class SecretaireLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSub?: Subscription;

  sidebarOpen = signal(true);
  pageTitle = signal('Accueil');
  profileMenuOpen = signal(false);
  notificationCount = signal(1);

  sidebarLinks: SidebarLink[] = [
    { label: 'Accueil', route: '/secretaire/accueil', icon: '🏠' },
    { label: 'Rendez-vous', route: '/secretaire/rendezvous', icon: '📅' },
    { label: 'Patients', route: '/secretaire/patients', icon: '🧑‍⚕️' },
    { label: 'Facturation', route: '/secretaire/facturation', icon: '💰' },
    { label: 'Feuille de soins', route: '/secretaire/feuille-soins', icon: '📋' },
    { label: 'Paramètres', route: '/secretaire/parametres', icon: '⚙️' }
  ];

  ngOnInit(): void {
    // Set initial title
    this.updateTitle(this.router.url);

    // Track route changes for page title
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitle(event.urlAfterRedirects || event.url);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(state => !state);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update(state => !state);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/secretaire/parametres']);
    this.profileMenuOpen.set(false);
  }

  private updateTitle(url: string): void {
    if (url.includes('/accueil')) {
      this.pageTitle.set('Accueil');
    } else if (url.includes('/rendezvous')) {
      this.pageTitle.set('Rendez-vous');
    } else if (url.includes('/patients')) {
      this.pageTitle.set('Patients');
    } else if (url.includes('/facturation')) {
      this.pageTitle.set('Facturation');
    } else if (url.includes('/feuille-soins')) {
      this.pageTitle.set('Feuille de soins');
    } else if (url.includes('/parametres')) {
      this.pageTitle.set('Paramètres');
    } else {
      this.pageTitle.set('Espace Secrétaire');
    }
  }
}
