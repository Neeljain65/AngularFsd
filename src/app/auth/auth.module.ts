import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './component/auth/login/login.component';
import { RegisterComponent } from './component/auth/register/register.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { StudentLoginComponent } from './component/auth/student-login/student-login.component';
import { ChangePasswordComponent } from './component/auth/change-password/change-password.component';
@NgModule({
  declarations: [LoginComponent, RegisterComponent,StudentLoginComponent, ChangePasswordComponent ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule, // For template-driven forms
    ReactiveFormsModule, // For reactive forms
  ],
  providers: [provideHttpClient(),AuthService],
})
export class AuthModule {}
