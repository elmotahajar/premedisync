import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="admin-badge" [ngClass]="getBadgeClass()">
      {{ label || status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() label: string = '';

  getBadgeClass(): string {
    const s = this.status?.toLowerCase();
    if (s === 'confirmé' || s === 'confirme' || s === 'confirmed' || s === 'active' || s === 'validé' || s === 'success') {
      return 'success';
    }
    if (s === 'en attente' || s === 'pending' || s === 'warning') {
      return 'warning';
    }
    if (s === 'annulé' || s === 'annule' || s === 'cancelled' || s === 'inactif' || s === 'danger') {
      return 'danger';
    }
    return 'info';
  }
}
