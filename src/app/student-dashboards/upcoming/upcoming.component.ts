import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

export interface SessionResponse {
  sessionid: number;
  topic: string;
  date: string;
  duration: number;
  time: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  trainer: {
    trainerid: number;
    trainername: string;
    expertise: string;
    email: string;
    password: string;
  };
  trainerid: number;
  batch: {
    batchid: number;
    type: string;
  };
  batchid: number;
}

@Component({
  selector: 'app-upcoming',
  standalone: false,
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.css'
})
export class UpcomingComponent implements OnInit {
  studentId: number = 0;
  upcomingSessions: SessionResponse[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUpcomingSessions();
  }

  fetchUpcomingSessions() {
    this.http.get<SessionResponse[]>(`http://localhost:8080/students/Session/${this.studentId}/upcoming`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.upcomingSessions = data;
        },
        error: (err) => {
          console.error('Error fetching sessions:', err);
        }
      });
  }
  
  formatTime(time: any): string {
    if (!time) return 'N/A';
    
    // If time is an object with hour/minute properties
    if (time.hour !== undefined) {
      const hour = time.hour > 12 ? time.hour - 12 : time.hour;
      const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
      const period = time.hour >= 12 ? 'PM' : 'AM';
      return `${hour}:${minute} ${period}`;
    }
    
    // If time is already a string
    return time;
  }
}