import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
})
export class ProfileComponent implements OnInit {
  studentId: number = 0;
  student: Student | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  editForm: FormGroup;
  updateSuccess: boolean = false;
  updateError: string = '';

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Initialize the form with empty values
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      feild: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(16), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.studentId);
    this.fetchStudentData();
  }
  
  fetchStudentData(): void {
    this.isLoading = true;
    
    this.http.get<Student>(`http://localhost:8080/students/${this.studentId}`).subscribe({
      next: (data) => {
        console.log('Fetched student:', data);
        this.student = data;
        this.isLoading = false;
        
        // Initialize form with student data
        this.editForm.patchValue({
          name: data.name,
          email: data.email,
          feild: data.feild,
          age: data.age
        });
      },
      error: (err) => {
        console.error('Error fetching student data:', err);
        this.isLoading = false;
      }
    });
  }
  
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    this.updateSuccess = false;
    this.updateError = '';
    
    if (!this.isEditing && this.student) {
      // Reset form to current values if canceling edit
      this.editForm.patchValue({
        name: this.student.name,
        email: this.student.email,
        feild: this.student.feild,
        age: this.student.age
      });
    }
  }
  
  saveChanges(): void {
    if (this.editForm.valid && this.student) {
      this.isLoading = true;
      
      // Create updated student object
      const updatedStudent = {
        ...this.student,
        name: this.editForm.value.name,
        email: this.editForm.value.email,
        feild: this.editForm.value.feild,
        age: this.editForm.value.age
      };
      
      // Call API to update student
      this.http.put<string>(
        `http://localhost:8080/students/${this.studentId}`, 
        updatedStudent
      ).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.student = updatedStudent; // Update local state
          this.isLoading = false;
          this.isEditing = false;
          this.updateSuccess = true;
          
          // Show success message briefly
          setTimeout(() => {
            this.updateSuccess = false;
          }, 5000);
        },
        error: (err) => {
          console.error('Error updating student:', err);
          this.isLoading = false;
          this.updateError = 'Failed to update profile. Please try again.';
        }
      });
    }
  }
}
