import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view-component.component.html',
  standalone: false,
  // styleUrls: ['./report-view.component.css']
})
export class ReportViewComponentComponent implements OnInit {
  // Define the properties for the component
  trainerId: number = 0; // Initialize with a default value
  reports: any[] = []; // Array to hold the reports
  isLoading = true; // Flag to show loading state
  errorMessage: string | null = null; // Error message if fetching reports fails

  constructor(private http: HttpClient, private route : ActivatedRoute) { }

  ngOnInit(): void {

    // Get the trainer ID from local storage
    this.trainerId=Number(this.route.snapshot.paramMap.get('id'));
    // Fetch reports for trainer 1 when component initializes
    this.getReports(this.trainerId).subscribe(
      (response: any[]) => {
        this.reports = response; // Store the fetched reports
        this.isLoading = false; // Hide loading indicator
      },
      (error) => {
        this.errorMessage = 'Error fetching reports';
        this.isLoading = false; // Hide loading indicator even in case of error
      }
    );
  }

  // Method to fetch reports from the backend
  getReports(trainerId: number): Observable<any[]> {
    const apiUrl = `http://localhost:8080/api/report/trainer/${trainerId}`;
    return this.http.get<any[]>(apiUrl); // Fetch reports for the trainer
  }
}
