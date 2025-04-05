import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentComponent } from './student/student.component';
import { TrainingSessionComponent } from './training-session/training-session.component';

@NgModule({
  declarations: [DashboardComponent, StudentComponent, TrainingSessionComponent],
  imports: [CommonModule,FormsModule, DashboardRoutingModule],
})
export class DashboardModule {}
