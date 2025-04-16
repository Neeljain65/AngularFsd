import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Trainer {
  trainerid: number,
  trainername: string,
  expertise: string,
  email: string,
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  trainerId: number = 0;
  trainer!: Trainer;
  today: Date = new Date();
  isLoading: boolean = true;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Trainer ID from route:', this.trainerId);

    this.http.get<Trainer>(`http://localhost:8080/trainers/${this.trainerId}`).subscribe({
      next: (data) => {
        console.log('Fetched trainer:', data);
        this.trainer = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching trainer:', error);
        this.isLoading = false;
      }
    });
  }

  goToTraining(): void {
    // Use parent component's setTab method or navigate directly
    // For now we'll use a simple approach to inform the parent component
    const parent = window.parent as any;
    if (parent && typeof parent.setActiveTab) {
      parent.setActiveTab('courses');
    } else {
      // Fallback - get the parent component to handle this
      const event = new CustomEvent('setActiveTab', { detail: 'courses' });
      window.dispatchEvent(event);
    }
  }

  goToStudents(): void {
    // Similar to goToTraining
    const parent = window.parent as any;
    if (parent && typeof parent.setActiveTab === 'function') {
      parent.setActiveTab('students');
    } else {
      const event = new CustomEvent('setActiveTab', { detail: 'students' });
      window.dispatchEvent(event);
    }
  }
}
