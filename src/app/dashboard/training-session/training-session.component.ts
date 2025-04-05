import { Component } from '@angular/core';

@Component({
  selector: 'app-training-session',
  standalone: false,
  
  templateUrl: './training-session.component.html',
  styleUrl: './training-session.component.css'
})
export class TrainingSessionComponent {
 selectedDate: string | null = null;
  sessions: { [date: string]: { trainer: string; batch: string } } = {};
  newSession = { trainer: '', batch: '' };

  openSessionModal(date: string) {
    this.selectedDate = date;
    this.newSession = { trainer: '', batch: '' }; // Reset form
  }

  saveSession() {
    if (this.selectedDate) {
      this.sessions[this.selectedDate] = { ...this.newSession };
      this.selectedDate = null;
    }
  }
}
