import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './patient-layout.html',
  styleUrls: ['./patient-layout.css']
})
export class PatientLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  private routerSub?: Subscription;

  sidebarOpen = signal(true);
  pageTitle = signal('Accueil');
  profileMenuOpen = signal(false);
  notificationCount = signal(2);
  
  patientName = signal('Patient');
  private apiUrl = 'http://localhost:3000/api';

  sidebarLinks: SidebarLink[] = [
    { label: 'Accueil', route: '/patient/accueil', icon: '🏠' },
    { label: 'Mes Rendez-vous', route: '/patient/rendezvous', icon: '📅' },
    { label: 'Mon Dossier', route: '/patient/dossier', icon: '📋' },
    { label: 'Mes Ordonnances', route: '/patient/ordonnances', icon: '💊' },
    { label: 'Mes Avis', route: '/patient/avis', icon: '💬' },
    { label: 'Paramètres', route: '/patient/parametres', icon: '⚙️' }
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

    // Fetch patient name
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get(`${this.apiUrl}/patient/profil`, { headers }).subscribe({
        next: (data: any) => {
          if (data && data.prenom && data.nom) {
            this.patientName.set(`${data.prenom} ${data.nom}`);
          }
        },
        error: (err) => console.error('Erreur chargement profil patient dans layout:', err)
      });
    }
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
    this.router.navigate(['/patient/parametres']);
    this.profileMenuOpen.set(false);
  }

  private updateTitle(url: string): void {
    if (url.includes('/accueil')) {
      this.pageTitle.set('Accueil');
    } else if (url.includes('/rendezvous')) {
      this.pageTitle.set('Mes Rendez-vous');
    } else if (url.includes('/dossier')) {
      this.pageTitle.set('Mon Dossier');
    } else if (url.includes('/ordonnances')) {
      this.pageTitle.set('Mes Ordonnances');
    } else if (url.includes('/avis')) {
      this.pageTitle.set('Mes Avis');
    } else if (url.includes('/parametres')) {
      this.pageTitle.set('Paramètres');
    } else {
      this.pageTitle.set('Espace Patient');
    }
  }
}
