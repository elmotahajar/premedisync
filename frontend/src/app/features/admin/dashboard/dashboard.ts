import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboard implements OnInit {
  private router = inject(Router);
  private adminService = inject(AdminService);

  stats = {
    totalConsultations: 0,
    totalPatients: 0,
    totalMedecins: 0,
    revenusMois: 0
  };
  loading: boolean = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
        this.loading = false;
      }
    });
  }

  goTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }

  retourAccueil() {
    this.router.navigate(['/home']);
  }
}