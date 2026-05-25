import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngStyle]="getStyles()" class="admin-skeleton"></div>
  `
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '8px';

  getStyles() {
    return {
      width: this.width,
      height: this.height,
      borderRadius: this.borderRadius
    };
  }
}
