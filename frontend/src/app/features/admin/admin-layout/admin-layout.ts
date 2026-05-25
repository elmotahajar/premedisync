import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true);
  pageTitle = signal('Dashboard');

  toggleSidebar(): void {
    this.sidebarOpen.update(state => !state);
  }

  onTitleChange(title: string): void {
    this.pageTitle.set(title);
  }
}
