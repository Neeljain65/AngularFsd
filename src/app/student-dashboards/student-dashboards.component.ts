import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Student {
  id: number;
  name: string;
  email: string;
  feild: string;
  age : number;
}

export interface AttendanceData {
  studentId: number;
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
}

export interface Skill {
  name: string;
  percentage: number;
  color: string;
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
    email: string;
    password: string;
  };
  trainerid: number;
  batch: {
    batchid: number;
    type: string;
  };
  batchid: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './student-dashboards.component.html',
  // styleUrls: ['./student-dashboards.component.css']
})
export class StudentDashboardComponent implements OnInit {
  daysInMonth = Array.from({length: 31}, (_, i) => i + 1);
  today = new Date();
  currentDay = this.today.getDate();

  constructor(private router: Router, private http : HttpClient
    , private route : ActivatedRoute
  ) {}
  
  students: Student[] = [];
  selectedTab: string = 'dashboard';
  studentId: number = 0;
  
  // New properties for dynamic data
  attendanceData: AttendanceData | null = null;
  completedSessionsCount: number = 0;
  skills: Skill[] = [];
  allSessions: Session[] = [];
  upcomingDeadlines: any[] = [];
  learningStreak: number = 0;

  setTab(tab: string) {
    this.selectedTab = tab;
  }
  
  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      this.router.navigate(['/']);
    } else if (role == 'Trainer') {
      this.router.navigate(['/']);
    }
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Student ID from route:', this.studentId);

    this.getTotalSessions();
    this.getAttendanceData();
    this.getAllSessions();
  }
  
  getTotalSessions() {
    this.http.get<any>(`http://localhost:8080/students/${this.studentId}`).subscribe({
      next: (res) => {
        this.students = [res];
        console.log('Fetched total sessions:', this.students);
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
      }
    });
  }
  
  // New method to fetch attendance data
  getAttendanceData() {
    this.http.get<AttendanceData>(`http://localhost:8080/students/${this.studentId}/attendance`).subscribe({
      next: (data) => {
        this.attendanceData = data;
        console.log('Attendance data:', this.attendanceData);
        
        // Calculate learning streak (placeholder algorithm - could be replaced with actual data)
        this.calculateLearningStreak();
      },
      error: (err) => {
        console.error('Error fetching attendance data:', err);
      }
    });
  }
  
  // Fetch all sessions to extract skills and completed sessions
  getAllSessions() {
    this.http.get<Session[]>(`http://localhost:8080/students/Session/${this.studentId}`).subscribe({
      next: (sessions) => {
        this.allSessions = sessions;
        console.log('All sessions:', this.allSessions);
        
        // Count completed sessions (past sessions)
        this.countCompletedSessions();
        
        // Extract skills from session topics
        this.extractSkillsFromSessions();
        
        // Get upcoming deadlines
        this.getUpcomingDeadlines();
      },
      error: (err) => {
        console.error('Error fetching all sessions:', err);
      }
    });
  }
  
  countCompletedSessions() {
    const today = new Date();
    this.completedSessionsCount = this.allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate < today;
    }).length;
  }
  
  extractSkillsFromSessions() {
    // Create a map to count occurrences of skills (based on topics)
    const skillMap = new Map<string, number>();
    const colors = ['indigo-500', 'blue-500', 'emerald-500', 'orange-500', 'purple-500', 'rose-500'];
    
    // Extract keywords from topics and count them
    this.allSessions.forEach(session => {
      const topic = session.topic.toLowerCase();
      
      if (topic.includes('frontend') || topic.includes('ui') || topic.includes('html') || 
          topic.includes('css') || topic.includes('angular')) {
        const count = skillMap.get('Frontend Development') || 0;
        skillMap.set('Frontend Development', count + 1);
      } 
      
      if (topic.includes('backend') || topic.includes('api') || topic.includes('server') || 
          topic.includes('java') || topic.includes('spring')) {
        const count = skillMap.get('Backend Development') || 0;
        skillMap.set('Backend Development', count + 1);
      }
      
      if (topic.includes('database') || topic.includes('sql') || topic.includes('nosql') || 
          topic.includes('mongo') || topic.includes('data')) {
        const count = skillMap.get('Database Management') || 0;
        skillMap.set('Database Management', count + 1);
      }
      
      if (topic.includes('devops') || topic.includes('cloud') || topic.includes('docker') || 
          topic.includes('kubernetes') || topic.includes('ci/cd')) {
        const count = skillMap.get('DevOps') || 0;
        skillMap.set('DevOps', count + 1);
      }
    });
    
    // If no skills found in topics, add default skills
    if (skillMap.size === 0) {
      skillMap.set('Frontend Development', 8);
      skillMap.set('Backend Development', 7);
      skillMap.set('Database Management', 6);
      skillMap.set('DevOps', 4);
    }
    
    // Calculate percentages based on counts
    const totalSessionsCount = this.allSessions.length > 0 ? this.allSessions.length : 10;
    const maxCount = Math.max(...Array.from(skillMap.values()));
    
    // Create skills array with percentages
    this.skills = Array.from(skillMap.entries()).map(([name, count], index) => {
      let percentage = Math.round((count / totalSessionsCount) * 100);
      // Ensure a minimum percentage for display purposes
      percentage = Math.max(percentage, 25);
      // Cap at 100%
      percentage = Math.min(percentage, 100);
      
      return {
        name,
        percentage,
        color: colors[index % colors.length]
      };
    });
  }
  
  getUpcomingDeadlines() {
    // Get future sessions and sort by date (closest first)
    const today = new Date();
    const upcomingSessions = this.allSessions
      .filter(session => new Date(session.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);  // Take top 3
    
    // Format for display
    this.upcomingDeadlines = upcomingSessions.map(session => {
      const sessionDate = new Date(session.date);
      const daysUntil = Math.ceil((sessionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let urgencyColor = 'green-400';
      if (daysUntil <= 2) {
        urgencyColor = 'red-400';
      } else if (daysUntil <= 5) {
        urgencyColor = 'yellow-400';
      }
      
      return {
        title: session.topic,
        daysUntil: daysUntil,
        dueDateText: this.getDueDateText(daysUntil),
        color: urgencyColor
      };
    });
  }
  
  getDueDateText(daysUntil: number): string {
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    if (daysUntil < 7) return `Due in ${daysUntil} days`;
    return `Due in ${Math.floor(daysUntil / 7)} week${Math.floor(daysUntil / 7) !== 1 ? 's' : ''}`;
  }
  
  calculateLearningStreak() {
    // This is a placeholder. In a real implementation, you would have a
    // more sophisticated algorithm based on daily login or activity data
    // For now, we'll generate a number between 1-14 based on the student ID
    this.learningStreak = (this.studentId % 14) + 1;
    if (this.learningStreak === 0) this.learningStreak = 7; // Default value
  }
  
  logout() {
    this.router.navigate(['/auth/login']);
  }
}
