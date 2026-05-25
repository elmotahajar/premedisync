import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from '../../core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notifService: NotificationsService) {}

  ngOnInit() {
    this.notifService.notifications$.subscribe(list => {
      this.notifications = list;
    });
  }

  markRead(n: Notification) {
    this.notifService.markAsRead(n.id);
  }
}