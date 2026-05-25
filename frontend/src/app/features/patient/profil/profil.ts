import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class Profil {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  successMessage = '';

  form = this.fb.group({
    nom: ['Dupont', [Validators.required]],
    prenom: ['Jean', [Validators.required]],
    email: ['jean.dupont@email.com', [Validators.required, Validators.email]],
    telephone: ['0612345678', [Validators.required]],
    dateNaissance: ['1990-01-01', [Validators.required]],
    adresse: ['12 rue de la Paix, Paris', [Validators.required]],
  });

  get f() { 
    return this.form.controls; 
  }

  champInvalide(champ: string): boolean {
    const c = this.form.get(champ);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  soumettre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.successMessage = 'Profil mis à jour avec succès !';
    setTimeout(() => this.successMessage = '', 3000);
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}