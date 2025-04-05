import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isStudentVisible = false;
  constructor(private router: Router) {}
  selectedTab: string = 'dashboard'; // Default view

  setTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit() {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      this.router.navigate(['/']);
    }else if(role=='Student')
    {
      this.router.navigate(['/student']);
    }
  }
  logout() {
    this.router.navigate(['/auth/login']);
  }
  showStudent() {
    this.isStudentVisible = true; // Toggle visibility
  }
}
