import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { StudentDashboardComponent } from './student-dashboards.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AllsessionsComponent } from './allsessions/allsessions.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    UpcomingComponent,
    StudentDashboardComponent,
    AllsessionsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule, HttpClientModule
  ],
  exports:[]
  
})
export class StudentDashboardsModule { }
