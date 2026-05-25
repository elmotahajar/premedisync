import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  erreur = signal('');
  chargement = signal(false);
  email = '';
  password = '';

  connexion() {
    this.chargement.set(true);
    this.erreur.set('');
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(err.error?.message || 'Email ou mot de passe incorrect');
        this.chargement.set(false);
      }
    });
  }
}