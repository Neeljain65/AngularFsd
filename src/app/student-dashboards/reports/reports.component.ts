import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({standalone: false,
  selector: 'app-reports',
  
  templateUrl: './reports.component.html',
  // styleUrls: ['./add-report.component.css']
})
export class ReportComponent implements OnInit {
  studentId: number = 0; // Initialize with a default value
  reportForm!: FormGroup;
  reports: any[] = []; // Array to hold the reports
  constructor(private fb: FormBuilder, private http: HttpClient , private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    // Initialize the form
    this.reportForm = this.fb.group({
      studentid: this.studentId, // Student ID is required
      feedback: ['', [Validators.required, Validators.maxLength(500)]], // Feedback is required and should be max 500 chars
    });
  }
  selectedTab: string = 'false';
  setTab(tab: string) {
    this.selectedTab = tab;
  }
  viewOldReports(): void {
    this.viewReports(this.studentId).subscribe(
      (response: any[]) => {
        this.reports = response;
        console.log(this.reports) // Store the fetched reports
       // Hide loading indicator
      },
      (error) => {
        console.log('Error fetching reports');
       // Hide loading indicator even in case of error
      }
    );
  }
  
 
  // Submit handler
  onSubmit(): void {
   
    if (this.reportForm.valid) {
      const reportData = this.reportForm.value;
      this.addReport(reportData ).subscribe(response => {
        console.log('Report added successfully', response);
        // You can show a success message or redirect as needed
        alert('Report added successfully!');
        this.reportForm.reset(); // Reset the form after submission
      }, error => {
        console.error('Error adding report', error);
        // Handle error (show message, etc.)
      });
    } else {
      console.log('Form is invalid');
    }
  }
  viewReports(studentid: number): Observable<any[]> {
    const apiUrl = `http://localhost:8080/api/report/student/${this.studentId}`; 
    return this.http.get<any[]>(apiUrl); // Fetch reports for the trainer
  }

  // Direct HTTP request to the backend
  addReport(reportData: any ,): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/report/add'; // Replace with your actual API URL
    return this.http.post(apiUrl, reportData ,{ responseType: 'text' });
  }
}
