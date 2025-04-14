import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Student {
  id: number;
  name: string;
  email: string;
  feild: string;
  age : number;
}
@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboards.component.html',
  // styleUrls: ['./student-dashboards.component.css']
})
export class StudentDashboardComponent {
  daysInMonth = Array.from({length: 31}, (_, i) => i + 1);
today = new Date();
currentDay = this.today.getDate();

  constructor(private router: Router, private http : HttpClient
    , private route : ActivatedRoute
  ) {

  }
  students: Student[] = [];
  selectedTab: string = 'dashboard';
  studentId: number = 0;

  setTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      this.router.navigate(['/']);
    } else if (role == 'Trainer') {
      this.router.navigate(['/']);
    }
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.studentId);

    this.getTotalSessions(); // Fetch on init
  }
  getTotalSessions() {
    this.http.get<any>(`http://localhost:8080/students/${this.studentId}`).subscribe({
      next: (res) => {
        this.students = [res];
        
        console.log('Fetched total sessions:', this.students);
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
      }
    });
  }
  logout() {
    this.router.navigate(['/auth/login']);
  }
}
