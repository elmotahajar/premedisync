import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  constructor(private router: Router) {}

  goTo(espace: string) {
    if (espace === 'patient') {
      this.router.navigate(['/dashboard']);
    } else if (espace === 'medecin') {
      this.router.navigate(['/medecin/dashboard']);
    } else if (espace === 'secretaire') {
      this.router.navigate(['/secretaire/']);
    } else if (espace === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}