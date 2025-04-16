import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Session {
  sessionid: number;
  date: string;
  time: string;
  batchid: string;
  trainerid: number;
  topic: string;
  duration: number;
}

interface Student {
  studentid: number;
  name: string;
  present: boolean;
}

@Component({
  selector: 'app-training-session',
  standalone: false,
  templateUrl: './training-session.component.html',
  styleUrls: ['./training-session.component.css']
})
export class TrainingSessionComponent implements OnInit {
  attendanceVisibleSessions: Session[] = [];
  studentsForAttendance: { [key: string]: Student[] } = {};
  fetchedAttendance: { [key: string]: any[] } = {};
  attendanceMarked: { [key: string]: boolean } = {};

  trainerId: number = 0;
  daysInMonth: { day: number, date: string }[] = [];
  sessions: Session[] = [];
  selectedDate: string = '';
  selectedSessions: Session[] = [];
  sessionForm: FormGroup;

  currentMonth: string = '';
  currentYear: number = 0;
  currentMonthIndex: number = 0;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.sessionForm = this.fb.group({
      time: ['', Validators.required],
      batchid: ['', Validators.required],
      trainerid: ['', Validators.required],
      topic: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
    this.trainerId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Trainer ID from route:', this.trainerId);
    this.sessionForm.patchValue({ trainerid: this.trainerId });

    // Initialize with current month
    this.currentMonthIndex = new Date().getMonth();
    this.generateCalendar();
    this.fetchSessions();
  }

  generateCalendar() {
    const now = new Date();
    const year = this.currentYear || now.getFullYear();
    const month = this.currentMonthIndex;
    const days = new Date(year, month + 1, 0).getDate();

    this.currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month));
    this.currentYear = year;

    this.daysInMonth = [];

    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.daysInMonth.push({ day: 0, date: '' });
    }

    for (let i = 1; i <= days; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      this.daysInMonth.push({ day: i, date: dateStr });
    }
  }

  nextMonth() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  previousMonth() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  goToCurrentMonth() {
    const now = new Date();
    this.currentMonthIndex = now.getMonth();
    this.currentYear = now.getFullYear();
    this.generateCalendar();
  }

  getCurrentDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  fetchSessions() {
    this.isLoading = true;
    this.http.get<Session[]>(`http://localhost:8080/api/Session/trainer/${this.trainerId}`)
      .subscribe({
        next: (res) => {
          console.log('Fetched sessions:', res);
          this.sessions = res;
          if (this.selectedDate) {
            this.onDateClick(this.selectedDate);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to fetch sessions:', err);
          this.isLoading = false;
        }
      });
  }

  isMarked(date: string): boolean {
    return this.sessions.some(s => s.date === date);
  }

  onDateClick(date: string) {
    this.selectedDate = date;
    this.selectedSessions = this.sessions.filter(s => s.date === date);
    this.sessionForm.patchValue({ trainerid: this.trainerId });
  }

  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  }

  saveSession() {
    if (this.sessionForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const newSession: Session = {
      sessionid: 0,
      date: this.selectedDate,
      ...this.sessionForm.value
    };

    this.http.post('http://localhost:8080/api/Session', newSession, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('Session saved:', res);
          // Generate a temporary ID for the new session
          const tempId = Date.now();
          this.sessions.push({ ...newSession, sessionid: tempId });
          this.onDateClick(this.selectedDate);
          this.sessionForm.reset();
          this.sessionForm.patchValue({ trainerid: this.trainerId });
          this.isLoading = false;
          
          // Refresh sessions to get the actual session ID from server
          setTimeout(() => this.fetchSessions(), 1000);
        },
        error: (err) => {
          console.error('Error saving session:', err);
          alert('Failed to save session');
          this.isLoading = false;
        }
      });
  }

  toggleAttendance(session: Session) {
    if (session.sessionid === undefined) {
      console.error('Session ID is undefined');
      return;
    }

    const index = this.attendanceVisibleSessions.findIndex(s => s.sessionid === session.sessionid);
    if (index > -1) {
      this.attendanceVisibleSessions.splice(index, 1);
    } else {
      this.attendanceVisibleSessions.push(session);
      this.isLoading = true;

      this.http.get<any[]>(`http://localhost:8080/api/attendance/session/${session.sessionid}`)
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.fetchedAttendance[session.sessionid] = res;
              this.attendanceMarked[session.sessionid] = true;
            } else {
              this.fetchStudents(session);
              this.attendanceMarked[session.sessionid] = false;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to fetch attendance:', err);
            this.fetchStudents(session);
            this.attendanceMarked[session.sessionid] = false;
            this.isLoading = false;
          }
        });
    }
  }

  fetchStudents(session: Session) {
    if (session.sessionid === undefined) {
      console.error('Session ID is undefined');
      return;
    }
    
    this.isLoading = true;
    this.http.get<Student[]>(`http://localhost:8080/students/batch/${session.batchid}`)
      .subscribe({
        next: (res) => {
          this.studentsForAttendance[session.sessionid] = res.map(student => ({
            ...student,
            present: false
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to fetch students:', err);
          this.studentsForAttendance[session.sessionid] = [];
          this.isLoading = false;
        }
      });
  }

  toggleAllStudents(sessionId: number) {
    const students = this.studentsForAttendance[sessionId];
    if (!students || students.length === 0) return;
    
    const allChecked = this.areAllStudentsChecked(sessionId);
    students.forEach(student => student.present = !allChecked);
  }

  areAllStudentsChecked(sessionId: number): boolean {
    const students = this.studentsForAttendance[sessionId];
    if (!students || students.length === 0) return false;
    return students.every(student => student.present);
  }

  isAttendanceVisible(session: Session): boolean {
    return this.attendanceVisibleSessions.some(s => s.sessionid === session.sessionid);
  }

  saveAttendance(session: Session) {
    const students = this.studentsForAttendance[session.sessionid];
    if (!students || students.length === 0) {
      alert('No students found for this session.');
      return;
    }

    this.isLoading = true;
    const attendanceRecords = students.map(student => ({
      attendanceId: 0,
      sessionid: session.sessionid,
      trainerid: session.trainerid,
      batchid: session.batchid,
      studentid: student.studentid,
      present: student.present,
      name: student.name
    }));

    // Use Promise.all to wait for all attendance markings
    const savePromises = attendanceRecords.map(record => 
      this.http.post('http://localhost:8080/api/attendance/mark', record, { responseType: 'text' })
        .toPromise()
        .catch(err => {
          console.error('Failed to save attendance:', err);
          return null;
        })
    );

    Promise.all(savePromises).then(() => {
      // After saving all records, update the UI
      this.fetchedAttendance[session.sessionid] = attendanceRecords;
      this.attendanceMarked[session.sessionid] = true;
      this.isLoading = false;
      alert('Attendance marked successfully!');
    });
  }

  updateAttendance(session: Session) {
    const attendanceData = this.fetchedAttendance[session.sessionid]
      .filter(student => student.present)
      .map(student => ({
        attendanceId: student.attendanceId || 0,
        sessionid: session.sessionid,
        trainerid: session.trainerid,
        batchid: session.batchid,
        studentid: student.studentid || student.studentId,
        present: true,
        name: student.name
      }));

    if (attendanceData.length === 0) {
      alert('No updates made!');
      return;
    }

    this.isLoading = true;
    this.http.post('http://localhost:8080/api/attendance/mark/bulk', attendanceData)
      .subscribe({
        next: (res) => {
          alert('Attendance updated!');
          this.toggleAttendance(session); // Close the attendance panel
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to update attendance:', err);
          alert('Error updating attendance!');
          this.isLoading = false;
        }
      });
  }
}
