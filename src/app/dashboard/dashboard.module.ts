import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentComponent } from './student/student.component';
import { TrainingSessionComponent } from './training-session/training-session.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [DashboardComponent, StudentComponent, TrainingSessionComponent, ProfileComponent],
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,  DashboardRoutingModule],
})
export class DashboardModule {}
