import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { StudentLoginComponent } from '../auth/component/auth/student-login/student-login.component';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

const routes = [{path: '', component: DashboardComponent}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentDashboardModule { }
