import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  erreur = signal('');
  chargement = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get f() {
    return this.form.controls;
  }

  champInvalide(champ: 'email' | 'password'): boolean {
    const control = this.form.get(champ);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  connexion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set('');
    this.authService.login({
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    }).subscribe({
      next: () => {
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(err?.message || 'Email ou mot de passe incorrect');
        this.chargement.set(false);
      }
    });
  }

  allerInscription(): void {
    this.router.navigate(['/inscription']);
  }
}