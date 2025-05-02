import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-reports',
  templateUrl: './reports.component.html',
})
export class ReportComponent implements OnInit {
  studentId: number = 0;
  reportForm!: FormGroup;
  reports: any[] = [];
  selectedTab: string = 'new'; // Default to 'new' tab
  isLoading: boolean = false;
  
  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Initialize the form
    this.reportForm = this.fb.group({
      studentid: this.studentId,
      feedback: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  setTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'history') {
      this.viewOldReports();
    }
  }

  viewOldReports(): void {
    this.isLoading = true;
    
    this.viewReports(this.studentId).subscribe({
      next: (response: any[]) => {
        this.reports = response;
        console.log('Fetched reports:', this.reports);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.isLoading = true;
      const reportData = this.reportForm.value;
      
      this.addReport(reportData).subscribe({
        next: (response) => {
          console.log('Report added successfully', response);
          this.isLoading = false;
          
          // Show success message and reset form
          alert('Your report has been submitted successfully!');
          this.reportForm.reset({ studentid: this.studentId });
          
          // Switch to history tab and refresh reports
          this.setTab('history');
        }, 
        error: (error) => {
          console.error('Error adding report', error);
          this.isLoading = false;
          alert('Failed to submit report. Please try again.');
        }
      });
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.reportForm.controls).forEach(key => {
        const control = this.reportForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  viewReports(studentid: number): Observable<any[]> {
    const apiUrl = `http://localhost:8080/api/report/student/${this.studentId}`;
    return this.http.get<any[]>(apiUrl);
  }

  addReport(reportData: any): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/report/add';
    return this.http.post(apiUrl, reportData, { responseType: 'text' });
  }
}
