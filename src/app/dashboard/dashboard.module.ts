import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentComponent } from './student/student.component';
import { TrainingSessionComponent } from './training-session/training-session.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ReportViewComponentComponent } from './report-view-component/report-view-component.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [DashboardComponent, StudentComponent, TrainingSessionComponent, ProfileComponent, ReportViewComponentComponent],
  imports: [ MatDatepickerModule, MatInputModule, MatNativeDateModule,
    NgChartsModule,CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DashboardRoutingModule, ],
})
export class DashboardModule {}
