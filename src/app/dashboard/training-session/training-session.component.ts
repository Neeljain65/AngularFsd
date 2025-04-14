import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Session {
  date: string;
  time: string;
  batchid: string;
  trainerid: number;
  topic: string;
  duration: number;
}

@Component({
  selector: 'app-training-session',
  standalone: false,
  templateUrl: './training-session.component.html',
  styleUrl: './training-session.component.css'
})
export class TrainingSessionComponent implements OnInit {
  trainerId: number = 0; // Initialize with a default value
  daysInMonth: { day: number, date: string }[] = [];
  sessions: Session[] = [];
  selectedDate: string = '';
  selectedSessions: Session[] = [];
  sessionForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.sessionForm = this.fb.group({
      sessionid: 3, // hardcoded for now — ideally auto-generated in backend
      time: [''],
      batchid: [''],
      trainerid: [''],
      topic: [''],
      duration: ['']
    });
  }

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.trainerId);

    this.generateCalendar();
    this.fetchSessions(); // Fetch sessions from backend
  }

  generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      this.daysInMonth.push({ day: i, date: dateStr });
    }
  }

  fetchSessions() {
    this.http.get<Session[]>(`http://localhost:8080/api/Session/trainer/${this.trainerId}`) // Replace '1' with the actual trainer ID
      .subscribe({
        next: (res) => {
          console.log('Fetched sessions:', res);
          this.sessions = res;
          if (this.selectedDate) {
            this.onDateClick(this.selectedDate); // refresh view if any date is already selected
          }
        },
        error: (err) => {
          console.error('Failed to fetch sessions:', err);
        }
      });
  }

  isMarked(date: string): boolean {
    return this.sessions.some(s => s.date === date);
  }

  onDateClick(date: string) {
    this.selectedDate = date;
    this.selectedSessions = this.sessions.filter(s => s.date === date);
    this.sessionForm.reset();
  }

  saveSession() {
    const newSession: Session = {
      date: this.selectedDate,
      ...this.sessionForm.value
    };

    this.http.post('http://localhost:8080/api/Session', newSession, { responseType: 'text' })
  .subscribe({
    next: (res) => {
      alert(res); // Now this will be: "Training session added successfully"
      this.sessions.push(newSession);
      this.onDateClick(this.selectedDate);
      this.sessionForm.reset(); // Reset the form after saving
      window.location.reload(); // Reload the page to reflect changes
    },
    error: (err) => {
      console.error('Error saving session:', err);
      alert('Failed to save session');
    }
  });

  }
}
