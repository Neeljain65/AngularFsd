import { Component, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
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
  studentId: number = 0; // Initialize with a default value
  upcomingSessions: SessionResponse[] = [];

  constructor(private http: HttpClient , private route : ActivatedRoute) {}

  ngOnInit(): void {
    // Assuming you can get the student ID from somewhere, e.g., route params or a service
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
}