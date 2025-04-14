import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const email = localStorage.getItem('email');
      if (!email) {
        alert("User not found.");
        return;
      }

      this.authService.changePassword(email, newPassword).subscribe({
        next: (res: any) => {
          alert("Password changed successfully!");
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error("Error changing password", err);
        }
      });
    }
  }
}
