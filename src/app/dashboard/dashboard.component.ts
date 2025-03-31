import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router) {}
  ngOnInit() {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
