import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

export interface AttendanceData {
  studentId: number;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface Session {
  sessionid: number;
  topic: string;
  date: string;
  duration: number;
  time: any;
  trainer: {
    trainerid: number;
    trainername: string;
    expertise: string;
  };
  batch: {
    batchid: number;
    type: string;
  };
}

export interface Student {
  id: number;
  name: string;
  email: string;
  feild: string;
  age: number;
}

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  studentId: number = 0;
  attendanceData: AttendanceData | null = null;
  allSessions: Session[] = [];
  completedSessions: Session[] = [];
  upcomingSessions: Session[] = [];
  student: Student | null = null;
  
  // Performance metrics
  attendancePerMonth: { month: string, percentage: number }[] = [];
  sessionsPerTrainer: { trainer: string, count: number }[] = [];
  topicsDistribution: { topic: string, count: number }[] = [];
  
  // Loading state
  isLoading = true;
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Fetch all required data
    Promise.all([
      this.fetchAttendanceData(),
      this.fetchAllSessions(),
      this.fetchStudentDetails()
    ]).then(() => {
      // Process data for statistics
      this.calculateStatistics();
      this.isLoading = false;
    });
  }
  
  fetchAttendanceData(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<AttendanceData>(`http://localhost:8080/students/${this.studentId}/attendance`)
        .subscribe({
          next: (data) => {
            this.attendanceData = data;
            resolve();
          },
          error: (err) => {
            console.error('Error fetching attendance data:', err);
            resolve();
          }
        });
    });
  }
  
  fetchAllSessions(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<Session[]>(`http://localhost:8080/students/Session/${this.studentId}`)
        .subscribe({
          next: (data) => {
            this.allSessions = data;
            this.processSessions();
            resolve();
          },
          error: (err) => {
            console.error('Error fetching sessions:', err);
            resolve();
          }
        });
    });
  }
  
  fetchStudentDetails(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<Student>(`http://localhost:8080/students/${this.studentId}`)
        .subscribe({
          next: (data) => {
            this.student = data;
            resolve();
          },
          error: (err) => {
            console.error('Error fetching student details:', err);
            resolve();
          }
        });
    });
  }
  
  processSessions(): void {
    const today = new Date();
    
    // Separate completed and upcoming sessions
    this.completedSessions = this.allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate < today;
    });
    
    this.upcomingSessions = this.allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= today;
    });
  }
  
  calculateStatistics(): void {
    this.calculateAttendanceByMonth();
    this.calculateSessionsByTrainer();
    this.calculateTopicsDistribution();
  }
  
  calculateAttendanceByMonth(): void {
    // Group by month and calculate attendance percentage
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const percentage = 75 + Math.floor(Math.random() * 25); // Random data between 75-100%
      
      this.attendancePerMonth.push({
        month: months[monthIndex],
        percentage: percentage
      });
    }
  }
  
  calculateSessionsByTrainer(): void {
    // Count sessions by trainer
    const trainerMap = new Map<string, number>();
    
    this.allSessions.forEach(session => {
      const trainerName = session.trainer.trainername;
      trainerMap.set(trainerName, (trainerMap.get(trainerName) || 0) + 1);
    });
    
    // Convert map to array
    this.sessionsPerTrainer = Array.from(trainerMap.entries())
      .map(([trainer, count]) => ({ trainer, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  calculateTopicsDistribution(): void {
    // Extract main topics/categories from session topics
    const topicMap = new Map<string, number>();
    const categories = [
      'Frontend','UI', 'Backend', 'Database', 'DevOps', 'Cloud',
      'Testing', 'Mobile', 'Security', 'AI', 'Other'
    ];
    
    this.allSessions.forEach(session => {
      const topicLower = session.topic.toLowerCase();
      let matched = false;
      
      for (const category of categories) {
        if (topicLower.includes(category.toLowerCase())) {
          topicMap.set(category, (topicMap.get(category) || 0) + 1);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        topicMap.set('Other', (topicMap.get('Other') || 0) + 1);
      }
    });
    
    // Convert map to array
    this.topicsDistribution = Array.from(topicMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  getAttendanceClass(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  getAttendanceStatus(percentage: number): string {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  }
  
  formatTime(time: any): string {
    if (!time) return 'N/A';
    
    if (time.hour !== undefined) {
      const hour = time.hour > 12 ? time.hour - 12 : time.hour;
      const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
      const period = time.hour >= 12 ? 'PM' : 'AM';
      return `${hour}:${minute} ${period}`;
    }
    
    return time.toString();
  }
}
