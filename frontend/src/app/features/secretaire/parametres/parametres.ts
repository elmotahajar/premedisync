import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-secretaire-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="parametres-container" style="max-width: 600px;">
      <h2 style="margin-bottom: 24px;">Paramètres du compte</h2>
      
      <div class="card" style="padding: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 18px; font-size: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
          Informations Secrétariat
        </h3>
        
        <form (ngSubmit)="save()" style="display: flex; flex-direction: column; gap: 16px;">
          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Identifiant</label>
            <input type="text" class="admin-input" value="sec.medisync" readonly name="username" />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Rôle</label>
            <input type="text" class="admin-input" value="Secrétaire médical(e)" readonly name="role" />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Nom d'affichage</label>
            <input type="text" class="admin-input" [(ngModel)]="displayName" name="displayName" />
          </div>

          <div class="form-field">
            <label class="muted" style="font-size: 13px;">Adresse Email de contact</label>
            <input type="email" class="admin-input" [(ngModel)]="email" name="email" />
          </div>

          <div style="margin-top: 12px;">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Enregistrer les modifications</button>
          </div>
        </form>
        
        @if (message()) {
          <div style="margin-top: 16px; color: var(--success); text-align: center; font-weight: 600;">
            {{ message() }}
          </div>
        }
      </div>
    </div>
  `
})
export class SecretaireParametresComponent {
  displayName = 'Secrétaire Général';
  email = 'secretaire@medisync.fr';
  message = signal('');

  save() {
    this.message.set('Paramètres enregistrés avec succès !');
    setTimeout(() => this.message.set(''), 3000);
  }
}
