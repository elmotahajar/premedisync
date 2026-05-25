import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  @Input() pageTitle: string = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  private router = inject(Router);

  notificationCount = signal(3);
  profileMenuOpen = signal(false);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleProfileMenu(): void {
    this.profileMenuOpen.update(state => !state);
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/admin/settings']);
    this.profileMenuOpen.set(false);
  }

  onNotifications(): void {
    console.log('Notifications clicked');
  }
}
