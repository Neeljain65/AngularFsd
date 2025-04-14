import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Session {
  sessionid: number;
  topic: string;
  date: string;
  duration: number;
  time: string;
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
export class AllsessionsComponent implements OnInit{
  constructor (private http: HttpClient , private route : ActivatedRoute) { }
  studentId: number = 0; // Initialize with a default value
  sessions: Session[] = [];
  ngOnInit(): void {
    // Assuming you can get the student ID from somewhere, e.g., route params or a service
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.getAllSessions(); // Fetch on init
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
}
