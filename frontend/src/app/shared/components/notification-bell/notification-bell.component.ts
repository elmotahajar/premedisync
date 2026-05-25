import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  isOpen = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private notifService: NotificationsService) {}

  ngOnInit() {
    this.notifService.notifications$.subscribe(list => {
      this.notifications = list;
      this.unreadCount = this.notifService.getUnreadCount();
    });
  }

  toggle() { this.isOpen = !this.isOpen; }

  markRead(n: Notification) {
    this.notifService.markAsRead(n.id);
  }
}
// import { NotificationsService } from '../../../core/services/notifications';