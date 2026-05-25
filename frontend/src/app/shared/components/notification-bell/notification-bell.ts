import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell {
  ouvert = false;
  notifications: string[] = [];

  toggleOuvert(): void {
    this.ouvert = !this.ouvert;
  }
}
