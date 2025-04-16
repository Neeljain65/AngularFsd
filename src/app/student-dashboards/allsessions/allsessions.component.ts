import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Session {
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
  selector: 'app-allsessions',
  standalone: false,
  templateUrl: './allsessions.component.html',
  styleUrl: './allsessions.component.css'
})
export class AllsessionsComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  
  studentId: number = 0;
  sessions: Session[] = [];
  
  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllSessions();
  }
  
  getAllSessions() {
    this.http.get<Session[]>(`http://localhost:8080/students/Session/${this.studentId}`).subscribe({
      next: (res) => {
        this.sessions = res;
        console.log('Fetched all sessions:', this.sessions);
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
