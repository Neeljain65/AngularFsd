import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { StudentDashboardComponent } from './student-dashboards.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AllsessionsComponent } from './allsessions/allsessions.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportComponent } from './reports/reports.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { StatsComponent } from './stats/stats.component';
// import { ReportsComponent } from './reports/reports.component';
@NgModule({
  declarations: [
    UpcomingComponent,
    StudentDashboardComponent,
    AllsessionsComponent,
    ProfileComponent,
    ReportComponent,
    StatsComponent
  ],
  imports: [
    CommonModule, HttpClientModule, FormsModule,  ReactiveFormsModule
  ],
  exports:[]
})
export class StudentDashboardsModule { }
