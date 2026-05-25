import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmation',
  imports: [FormsModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  medecin = history.state.medecin;
  
  motif = '';
  date = '';
  heure = '';
  pourTiers = false;
  nomTiers = '';
  
  confirme = signal(false);

  creneaux = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  confirmerRdv(): void {
    if (this.date && this.heure && this.motif) {
      this.confirme.set(true);
    }
  }
}
