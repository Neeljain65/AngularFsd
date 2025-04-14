import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Student {
  studentid: number;
  name: string;
  email: string;
  feild: string;
  age: number;
  type: string;
  batchid: string;
  
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  // styleUrls: ['./student.component.css']
})
export class ProfileComponent implements OnInit {
  trainerId: number = 0; // Initialize with a default value
  student!: Student;

  
  

  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.trainerId);

    this.http.get<Student>(`http://localhost:8080/students/${this.trainerId}`).subscribe(data => {
      console.log('Fetched student:', data);
      this.student = data;
    });
    
  }

  
}
