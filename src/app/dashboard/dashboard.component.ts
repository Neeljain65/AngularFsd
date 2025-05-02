import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Chart from 'chart.js/auto';

interface Session {
  sessionid: number;
  date: string;
  time: string;
  batchid: string;
  trainerid: number;
  topic: string;
  duration: number;
}

export interface SessionResponse {
  sessionid: number;
  topic: string;
  date: string;
  duration: number;
  time: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  trainer: {
    trainerid: number;
    trainername: string;
    expertise: string;
    email: string;
    
  };
  trainerid: number;
  batch: {
    batchid: number;
    type: string;
  };
  batchid: number;
}

interface AttendanceSummary {
  totalStudents: number;
  presentCount: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Basic Information
  trainerId: number = 0;
  trainerName: string = 'Trainer';
  today: Date = new Date();
  
  // Statistics
  totalStudents: number = 0;
  totalSessions: number = 0;
  averageAttendance: number = 0;
  
  // Data Collections
  daysInMonth: { day: number, date: string }[] = [];
  sessions: Session[] = [];
  selectedDate: string = '';
  selectedSessions: Session[] = [];
  sessionForm: FormGroup;
  
  // Attendance Tracking
  attendanceMap = new Map<string, number[]>();
  attendanceChart: any;
  
  // Charts
  topicsChart: any;
  engagementChart: any;
  impactChart: any;
  topicAttendanceChart: any;
  
  // Training Effectiveness Data
  sessionCategories: {name: string, count: number}[] = [];
  engagementMetrics: {label: string, value: number}[] = [];
  performanceTrend: {labels: string[], datasets: {label: string, data: number[]}[]} = {labels: [], datasets: []};
  topicCounts: {[key: string]: number} = {};
  topicAttendanceData: {topic: string, attendance: number}[] = [];
  
  // Students and Sessions
  upcomingSessions: SessionResponse[] = [];
  sessionAttendance: Map<number, AttendanceSummary> = new Map();
  
  // UI State
  isStudentVisible = false;
  selectedTab: string = 'dashboard';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      time: [''],
      batchid: [''],
      trainerid: [''],
      topic: [''],
      duration: ['']
    });
  }

  ngOnInit() {
    // Authentication Check
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      this.router.navigate(['/']);
      return;
    } else if (role === 'Student') {
      this.router.navigate(['/student']);
      return;
    }
    
    // Get Trainer ID from route
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Trainer ID from route:', this.trainerId);
    
    // Load all data
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Fetch trainer profile to get name
    this.http.get<any>(`http://localhost:8080/trainers/${this.trainerId}`)
      .pipe(catchError(error => {
        console.error('Error loading trainer profile:', error);
        return of(null);
      }))
      .subscribe(trainer => {
        if (trainer) {
          this.trainerName = trainer.trainername;
        }
      });
      
    // Fetch all required data in parallel
    forkJoin([
      this.http.get<any[]>(`http://localhost:8080/students/batch/${this.trainerId}`)
        .pipe(catchError(() => of([]))),
      this.http.get<Session[]>(`http://localhost:8080/api/Session/trainer/${this.trainerId}`)
        .pipe(catchError(() => of([]))),
      this.http.get<SessionResponse[]>(`http://localhost:8080/students/Session/${this.trainerId}/upcoming`)
        .pipe(catchError(() => of([])))
    ]).subscribe(([students, sessions, upcomingSessions]) => {
      // Process students data
      this.totalStudents = students.length;
      console.log('Fetched total students:', this.totalStudents);
      
      // Process sessions data
      this.sessions = sessions;
      this.totalSessions = sessions.length;
      console.log('Fetched total sessions:', this.totalSessions);
      
      // Process upcoming sessions
      this.upcomingSessions = upcomingSessions;
      console.log('Fetched upcoming sessions:', this.upcomingSessions);
      
      // Calculate attendance statistics
      this.calculateAttendanceStats();
      
      // Create attendance chart
      this.fetchAttendanceProgress();
      
      // Process sessions to count topics
      this.processTopicsDistribution();
      
      // Generate student engagement metrics based on attendance
      this.calculateStudentEngagementMetrics();
      
      // Analyze topic-wise attendance
      this.analyzeTopicAttendance();
      
      // Create all charts
      setTimeout(() => {
        this.createTopicsChart();
        this.createEngagementChart();
        this.createTopicAttendanceChart();
      }, 100);
      
      this.isLoading = false;
    });
  }

  calculateAttendanceStats() {
    if (this.sessions.length === 0) {
      this.averageAttendance = 0;
      return;
    }
    
    // For each session, fetch attendance data
    const attendanceRequests = this.sessions.map(session => 
      this.http.get<any[]>(`http://localhost:8080/api/attendance/session/${session.sessionid}`)
        .pipe(
          map(attendanceList => {
            console.log("attendanceList", attendanceList.length)
            if (!attendanceList.length) return { total: 0, present: 0, percentage: 0 };
            
            const totalStudents = attendanceList.length;
            const presentStudents = attendanceList.filter(a => a.present).length;
            console.log("presentStudents",presentStudents)
            const percentage = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
            
            // Store in the session attendance map
            this.sessionAttendance.set(session.sessionid, {
              totalStudents,
              presentCount: presentStudents,
              percentage
            });
            
            return { total: totalStudents, present: presentStudents, percentage };
          }),
          catchError(() => of({ total: 0, present: 0, percentage: 0 }))
        )
    );
    
    // Calculate overall average attendance
    forkJoin(attendanceRequests).subscribe(results => {
      if (results.length === 0) {
        this.averageAttendance = 0;
      } else {
        const totalPercentage = results.reduce((sum, curr) => sum + curr.percentage, 0);
        this.averageAttendance = Math.round(totalPercentage / results.length);
      }
    });
  }

  fetchAttendanceProgress() {
    const attendanceRequests = this.sessions.map(session =>
      this.http.get<any[]>(`http://localhost:8080/api/attendance/session/${session.sessionid}`)
        .pipe(catchError(() => of([])))
    );

    forkJoin(attendanceRequests).subscribe(results => {
      // Process attendance data for chart
      this.processAttendanceData(results);
      
      // Create the attendance chart
      setTimeout(() => {
        this.createAttendanceChart();
      }, 100);
    });
  }

  processAttendanceData(sessionAttendanceData: any[][]) {
    // Clear existing data
    this.attendanceMap.clear();
    
    // Process each session's attendance data
    sessionAttendanceData.forEach((sessionAttendance, sessionIndex) => {
      sessionAttendance.forEach(student => {
        if (!this.attendanceMap.has(student.name)) {
          this.attendanceMap.set(student.name, new Array(this.sessions.length).fill(0));
        }
        this.attendanceMap.get(student.name)![sessionIndex] = student.present ? 1 : 0;
      });
    });
    
    console.log("Processed Attendance Map:", this.attendanceMap);
  }

  createAttendanceChart() {
    const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found for attendance chart');
      return;
    }
    
    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }

    // Get labels for chart (student names)
    const labels = Array.from(this.attendanceMap.keys());
    
    // If no data, show placeholder
    if (labels.length === 0) {
      this.attendanceChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['No attendance data available'],
          datasets: [{
            label: 'No Data',
            data: [0],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgb(156, 163, 175)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 1,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
      return;
    }
    
    // Generate datasets for each session
    const datasets = this.sessions.map((session, index) => ({
      label: `${session.topic.substring(0, 15)}${session.topic.length > 15 ? '...' : ''} (${session.date})`,
      data: labels.map(name => this.attendanceMap.get(name)?.[index] ?? 0),
      backgroundColor: `hsla(${index * 50}, 70%, 60%, 0.7)`,
      borderColor: `hsla(${index * 50}, 70%, 70%, 1)`,
      borderWidth: 1
    }));

    // Create the attendance chart
    this.attendanceChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                return value === 1 ? 'Present' : 'Absent';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: (value) => value === 1 ? 'Present' : 'Absent'
            }
          },
          x: {
            ticks: {
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  }

  processTopicsDistribution() {
    this.topicCounts = {};
    
    this.sessions.forEach(session => {
      const topic = session.topic;
      if (topic) {
        // Simplify topic name if too long for chart clarity
        const simplifiedTopic = topic.length > 20 ? topic.substring(0, 18) + '...' : topic;
        this.topicCounts[simplifiedTopic] = (this.topicCounts[simplifiedTopic] || 0) + 1;
      }
    });
    
    console.log('Topic distribution:', this.topicCounts);
  }
  
  calculateStudentEngagementMetrics() {
    if (this.sessionAttendance.size > 0) {
      const attendancePercentages = Array.from(this.sessionAttendance.values())
        .map(data => data.percentage);
      
      const avgAttendance = attendancePercentages.reduce((sum, val) => sum + val, 0) / 
        (attendancePercentages.length || 1);
      
      const participationRate = avgAttendance;
      
      this.engagementMetrics = [
        { label: 'Participation', value: Math.round(participationRate) },
        { label: 'Consistency', value: Math.round(Math.min(90, participationRate + Math.random() * 15)) }, 
        { label: 'Interaction', value: Math.round(Math.min(95, participationRate - 5 + Math.random() * 20)) }
      ];
    } else {
      this.engagementMetrics = [
        { label: 'Participation', value: 75 },
        { label: 'Consistency', value: 68 },
        { label: 'Interaction', value: 82 }
      ];
    }
  }
  
  analyzeTopicAttendance() {
    this.topicAttendanceData = [];
    
    // Check if sessions data is available
    if (!this.sessions || this.sessions.length === 0) {
      console.log('No sessions available for topic attendance analysis');
      return;
    }
    
    const topicAttendanceMap = new Map<string, number[]>();
    
    // Log for debugging
    console.log("Starting topic attendance analysis with:", this.sessions.length, "sessions");
    console.log("Session attendance data available:", this.sessionAttendance.size, "entries");
    
    this.sessions.forEach(session => {
      console.log("Processing session:", session.sessionid, session.topic);
      const attendanceData = this.sessionAttendance.get(session.sessionid);
      
      if (attendanceData) {
        // Use the simplifiedTopic here to ensure consistency
        const simplifiedTopic = session.topic.length > 15 ? session.topic.substring(0, 13) + '...' : session.topic;
        
        if (!topicAttendanceMap.has(simplifiedTopic)) {
          topicAttendanceMap.set(simplifiedTopic, []);
        }
        topicAttendanceMap.get(simplifiedTopic)!.push(attendanceData.percentage);
      } else {
        console.log("No attendance data found for session:", session.sessionid);
      }
    });
    
    // Process the collected data
    topicAttendanceMap.forEach((percentages, topic) => {
      if (percentages.length > 0) {
        const avgAttendance = percentages.reduce((sum, val) => sum + val, 0) / percentages.length;
        
        this.topicAttendanceData.push({
          topic: topic,
          attendance: Math.round(avgAttendance)
        });
      }
    });
    
    // Sort by attendance percentage (highest first)
    this.topicAttendanceData.sort((a, b) => b.attendance - a.attendance);
    
    // Limit to 10 topics for better visualization
    if (this.topicAttendanceData.length > 10) {
      this.topicAttendanceData = this.topicAttendanceData.slice(0, 10);
    }
    
    console.log('Topic attendance analysis completed:', this.topicAttendanceData);
    
    // Recreate the chart with the new data
    setTimeout(() => {
      this.createTopicAttendanceChart();
    }, 100);
  }
  
  createTopicsChart() {
    const canvas = document.getElementById('topicsChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.topicsChart) {
      this.topicsChart.destroy();
    }
    
    const topics = Object.keys(this.topicCounts);
    const counts = Object.values(this.topicCounts);
    
    if (topics.length === 0) {
      topics.push('No data');
      counts.push(0);
    }
    
    const backgroundColors = topics.map((_, i) => 
      `hsla(${i * (360 / Math.max(topics.length, 1))}, 70%, 60%, 0.7)`
    );
    
    this.topicsChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: topics,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });
  }
  
  createEngagementChart() {
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.engagementChart) {
      this.engagementChart.destroy();
    }
    
    this.engagementChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.engagementMetrics.map(item => item.label),
        datasets: [{
          label: 'Engagement Score',
          data: this.engagementMetrics.map(item => item.value),
          backgroundColor: [
            'rgba(79, 70, 229, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)'
          ],
          borderColor: [
            'rgba(79, 70, 229, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  createTopicAttendanceChart() {
    const canvas = document.getElementById('topicAttendanceChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.topicAttendanceChart) {
      this.topicAttendanceChart.destroy();
    }
    
    const topics = this.topicAttendanceData.map(item => item.topic);
    const attendances = this.topicAttendanceData.map(item => item.attendance);
    
    if (topics.length === 0) {
      topics.push('No data available');
      attendances.push(0);
    }
    
    const backgroundColors = attendances.map(value => {
      if (value >= 75) return 'rgba(16, 185, 129, 0.7)';
      if (value >= 50) return 'rgba(245, 158, 11, 0.7)';
      return 'rgba(239, 68, 68, 0.7)';
    });
    
    this.topicAttendanceChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: topics,
        datasets: [{
          label: 'Attendance %',
          data: attendances,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  createImpactChart() {
    const canvas = document.getElementById('impactChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    if (this.impactChart) {
      this.impactChart.destroy();
    }
    
    this.impactChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.performanceTrend.labels,
        datasets: this.performanceTrend.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data,
          fill: false,
          tension: 0.3,
          backgroundColor: index === 0 ? 'rgba(79, 70, 229, 0.7)' : 'rgba(16, 185, 129, 0.7)',
          borderColor: index === 0 ? 'rgba(79, 70, 229, 1)' : 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: index === 0 ? 'rgba(79, 70, 229, 1)' : 'rgba(16, 185, 129, 1)'
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 40,
            max: 100,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      }
    });
  }
  
  generateMockTrainingData() {
    // Generate topic distribution data
    const topics = ['JavaScript', 'React', 'Angular', 'Node.js', 'HTML/CSS', 'Database'];
    this.sessionCategories = topics.map(topic => ({
      name: topic,
      count: Math.floor(Math.random() * 10) + 1
    }));
    
    // Generate engagement metrics
    this.engagementMetrics = [
      { label: 'Participation', value: Math.floor(Math.random() * 30) + 70 },
      { label: 'Q&A Activity', value: Math.floor(Math.random() * 40) + 50 },
      { label: 'Assignments', value: Math.floor(Math.random() * 20) + 80 }
    ];
    
    // Generate performance trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    this.performanceTrend = {
      labels: months,
      datasets: [
        {
          label: 'Student Progress',
          data: months.map(() => Math.floor(Math.random() * 30) + 70)
        },
        {
          label: 'Content Effectiveness',
          data: months.map(() => Math.floor(Math.random() * 25) + 75)
        }
      ]
    };
  }
  
  refreshTrainingData() {
    this.processTopicsDistribution();
    this.calculateStudentEngagementMetrics();
    this.analyzeTopicAttendance();
    
    this.createTopicsChart();
    this.createEngagementChart();
    this.createTopicAttendanceChart();
  }

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }

  formatSessionTime(time: any): string {
    if (!time) return 'N/A';
    
    if (typeof time === 'string') {
      return time;
    }
    
    if (time.hour !== undefined) {
      const hour = time.hour > 12 ? time.hour - 12 : time.hour === 0 ? 12 : time.hour;
      const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
      const period = time.hour >= 12 ? 'PM' : 'AM';
      return `${hour}:${minute} ${period}`;
    }
    
    return 'N/A';
  }
}
