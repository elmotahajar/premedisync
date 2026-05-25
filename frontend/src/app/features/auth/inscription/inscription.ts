import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    telephone: ['']
  });

  erreur = signal('');
  succes = signal('');
  chargement = signal(false);

  get f() { return this.form.controls; }

  champInvalide(champ: string): boolean {
    const c = this.form.get(champ);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  soumettre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.chargement.set(true);
    this.erreur.set('');
    this.succes.set('');

    const data = {
      nom: this.form.value.nom,
      prenom: this.form.value.prenom,
      email: this.form.value.email,
      password: this.form.value.motDePasse,
      telephone: this.form.value.telephone,
      role: 'patient'
    };

    this.authService.inscription(data).subscribe({
      next: () => {
        this.succes.set('✅ Compte créé avec succès ! Redirection...');
        this.form.reset();
        this.chargement.set(false);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.erreur.set(err.error?.message || 'Erreur lors de l\'inscription');
        this.chargement.set(false);
      }
    });
  }
}