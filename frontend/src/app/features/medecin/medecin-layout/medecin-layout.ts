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
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './medecin-layout.html',
  styleUrls: ['./medecin-layout.css']
})
export class MedecinLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  private routerSub?: Subscription;

  sidebarOpen = signal(true);
  pageTitle = signal('Accueil');
  profileMenuOpen = signal(false);
  notificationCount = signal(3);
  
  doctorName = signal('Dr. Médecin');
  doctorSpecialty = signal('Généraliste');
  private apiUrl = 'http://localhost:3000/api';

  sidebarLinks: SidebarLink[] = [
    { label: 'Accueil', route: '/medecin/accueil', icon: '🏠' },
    { label: 'Mon Planning', route: '/medecin/planning', icon: '📅' },
    { label: 'Mes Patients', route: '/medecin/patients', icon: '👥' },
    { label: 'Consultations', route: '/medecin/consultations', icon: '📋' },
    { label: 'Prescriptions', route: '/medecin/prescriptions', icon: '💊' },
    { label: 'Disponibilités', route: '/medecin/disponibilites', icon: '🕒' },
    { label: 'Paramètres', route: '/medecin/parametres', icon: '⚙️' }
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

    // Fetch doctor name
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get(`${this.apiUrl}/medecin/profil`, { headers }).subscribe({
        next: (data: any) => {
          if (data && data.nom) {
            this.doctorName.set(`Dr. ${data.nom}`);
            if (data.specialite) {
              this.doctorSpecialty.set(data.specialite);
            }
          }
        },
        error: (err) => console.error('Erreur chargement profil médecin dans layout:', err)
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
    this.router.navigate(['/medecin/parametres']);
    this.profileMenuOpen.set(false);
  }

  private updateTitle(url: string): void {
    if (url.includes('/accueil')) {
      this.pageTitle.set('Accueil');
    } else if (url.includes('/planning')) {
      this.pageTitle.set('Mon Planning');
    } else if (url.includes('/patients')) {
      this.pageTitle.set('Mes Patients');
    } else if (url.includes('/consultations')) {
      this.pageTitle.set('Mes Consultations');
    } else if (url.includes('/prescriptions') || url.includes('/prescription')) {
      this.pageTitle.set('Mes Prescriptions');
    } else if (url.includes('/disponibilites')) {
      this.pageTitle.set('Mes Disponibilités');
    } else if (url.includes('/parametres')) {
      this.pageTitle.set('Paramètres');
    } else {
      this.pageTitle.set('Espace Médecin');
    }
  }
}
