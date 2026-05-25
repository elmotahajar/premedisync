import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible()" class="toast-box" [class]="type">
      <span class="toast-icon">{{ getIcon() }}</span>
      <span class="toast-message">{{ message }}</span>
      <button (click)="close()" class="toast-close">×</button>
    </div>
  `,
  styles: [`
    .toast-box {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      color: #f1f5f9;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
    }
    .toast-box.success { border-left: 4px solid #10b981; }
    .toast-box.error { border-left: 4px solid #ef4444; }
    .toast-box.warning { border-left: 4px solid #f59e0b; }
    .toast-box.info { border-left: 4px solid #0ea5e9; }
    .toast-icon { font-size: 16px; }
    .toast-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      margin-left: 8px;
      display: flex;
      align-items: center;
    }
    .toast-close:hover { color: #f1f5f9; }
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() duration: number = 3000;

  visible = signal(true);

  ngOnInit() {
    setTimeout(() => this.close(), this.duration);
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }

  close() {
    this.visible.set(false);
  }
}
