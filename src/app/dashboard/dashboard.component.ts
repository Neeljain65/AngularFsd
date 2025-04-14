import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {
  trainerId: number = 0; // Initialize with a default value
  totalStudents: number = 0;
  totalSessions: number = 0;
 
  constructor(private fb: FormBuilder, private Http: HttpClient, private router: Router, private route : ActivatedRoute) {}

  getTotalStudents() {
    this.Http.get<any[]>(`http://localhost:8080/students/${this.trainerId}`,).subscribe({
      next: (res) => {
        this.totalStudents = res.length;
        console.log('Fetched total students:', this.totalStudents);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      }
    });
  }
  getTotalSessions() {
    this.Http.get<any>(`http://localhost:8080/api/Session/trainer/${this.trainerId}`).subscribe({
      next: (res) => {
        this.totalSessions = res.length;
        console.log('Fetched total sessions:', this.totalSessions);
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
      }
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      this.router.navigate(['/']);
    } else if (role === 'Student') {
      this.router.navigate(['/student']);
    }
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.trainerId);

    this.getTotalStudents(); // Fetch on init
    this.getTotalSessions(); // Fetch on init
  }

  isStudentVisible = false;
  selectedTab: string = 'dashboard';

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }

  showStudent() {
    this.isStudentVisible = true;
  }
}
