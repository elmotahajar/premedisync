import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-secretaire',
  imports: [RouterLink],
  templateUrl: './dashboard-secretaire.html',
  styleUrl: './dashboard-secretaire.css',
})
export class DashboardSecretaire {
  private router = inject(Router);
  private authService = inject(AuthService);

  seDeconnecter(): void {
    this.authService.logout();
  }
}