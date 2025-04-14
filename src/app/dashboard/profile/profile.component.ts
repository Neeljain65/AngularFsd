import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  // styleUrls: ['./student.component.css']
})
export class ProfileComponent implements OnInit {
  trainerId: number = 0; // Initialize with a default value
  trainer!: Trainer;

  
  

  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.trainerId);

    this.http.get<Trainer>(`http://localhost:8080/trainers/${this.trainerId}`).subscribe(data => {
      console.log('Fetched student:', data);
      this.trainer = data;
    });
    
  }

  
}
