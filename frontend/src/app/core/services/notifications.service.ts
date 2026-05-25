import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private list: Notification[] = [];
  private subject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.subject.asObservable();

  // Appelle ça après le login avec l'id du user
  connect(userId: string) {
    const eventSource = new EventSource(
      `http://localhost:3000/api/notifications/stream/${userId}`
    );
    eventSource.onmessage = (event) => {
      const notif: Notification = JSON.parse(event.data);
      this.list.unshift(notif);
      this.subject.next([...this.list]);
    };
  }

  // Pour tester SANS backend (appelle ça dans ngOnInit de app.component)
  addFake(message: string) {
    const notif: Notification = {
      id: Date.now().toString(),
      message,
      type: 'info',
      read: false,
      createdAt: new Date()
    };
    this.list.unshift(notif);
    this.subject.next([...this.list]);
  }

  getAll() { return this.list; }

  markAsRead(id: string) {
    const n = this.list.find(n => n.id === id);
    if (n) { n.read = true; this.subject.next([...this.list]); }
  }

 
  getUnreadCount() { return this.list.filter(n => !n.read).length; }
}