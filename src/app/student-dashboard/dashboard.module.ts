import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentDashboardModule } from './student-dashboard-roting.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, StudentDashboardModule],
})
export class DashboardModule {}
