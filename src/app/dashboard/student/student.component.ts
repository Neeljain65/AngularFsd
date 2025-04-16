import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';

interface Student {
  studentid: number;
  name: string;
  email: string;
  feild: string;
  age: number;
  type: string;
  batchid: string;
}

interface Attendance {
  studentId: number;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  trainerId: number = 0;
  students: Student[] = [];
  batchid: string[] = [];
  
  filteredStudents: Student[] = [];
  selectedStudent: Student | null = null;
  attendanceData: Attendance | null = null;
  selectedBatchId: string = '';
  isLoading: boolean = false;

  // Chart data and options
  public attendanceChartData: ChartData<'bar'> = {
    labels: ['Total Classes', 'Attended Classes', 'Missed Classes'],
    datasets: [
      {
        label: 'Classes',
        data: [0, 0, 0],
        backgroundColor: ['#6366F1', '#10B981', '#F87171'],
        borderColor: ['#4F46E5', '#059669', '#EF4444'],
        borderWidth: 1
      }
    ]
  };

  public attendanceChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Trainer ID from route:', this.trainerId);
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.isLoading = true;
    this.http.get<Student[]>(`http://localhost:8080/students/batch/${this.trainerId}`).subscribe({
      next: (data) => {
        console.log('Fetched students:', data);
        this.students = data;
        this.batchid = [...new Set(data.map(s => s.batchid))];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.isLoading = false;
      }
    });
  }

  selectBatch(batch: string): void {
    this.selectedBatchId = batch;
    this.filteredStudents = this.students.filter(s => s.batchid === batch);
    this.selectedStudent = null;
    this.attendanceData = null; // Reset attendance data when a new batch is selected
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.isLoading = true;
    
    this.http.get<Attendance>(`http://localhost:8080/api/attendance/student/${student.studentid}`).subscribe({
      next: (data) => {
        console.log('Fetched attendance:', data);
        this.attendanceData = data;

        // Calculate missed classes
        const missedClasses = data.totalClasses - data.attendedClasses;

        // Update chart data
        this.attendanceChartData.datasets[0].data = [
          data.totalClasses,
          data.attendedClasses,
          missedClasses
        ];
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching attendance:', error);
        this.attendanceData = null;
        this.isLoading = false;
      }
    });
  }
}
