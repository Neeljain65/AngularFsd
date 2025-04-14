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
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  trainerId: number = 0; // Initialize with a default value
  students: Student[] = [];
  batchid: string[] = [];
  
  filteredStudents: Student[] = [];
  selectedStudent: Student | null = null;

  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.trainerId);

    this.http.get<Student[]>(`http://localhost:8080/students/batch/${this.trainerId}`).subscribe(data => {
      console.log('Fetched students:', data);
      this.students = data;
      
      this.batchid= [...new Set(data.map(s => s.batchid))];
    });
  }

  selectBatch(batch: string): void {
    this.filteredStudents = this.students.filter(s => s.batchid === batch);
    this.selectedStudent = null;
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }
}
