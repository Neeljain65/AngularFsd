import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // myForm = new FormGroup({
  // //   name: new FormControl('', [Validators.required, Validators.minLength(6)]),
  // //   email: new FormControl('', [Validators.required, Validators.email]),
  // //   password: new FormControl('', [
  // //     Validators.required,
  // //     Validators.minLength(6),
  // //   ]),
  // // });
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router , private authService: AuthService) {
    this.myForm = this.fb.group({
      // name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    
    });
  }
  ngOnInit(){
    if(localStorage.getItem('token')){
      this.router.navigate(['/dashboard']);
    }
  }

  submitLogin() {
    if (this.myForm.valid) {
      console.log('Login Data:', this.myForm.value);
      this.authService.loginUser(this.myForm.value).subscribe({
        next: (response: any) => {
          console.log("res", response);
          if (response) {
            localStorage.setItem('token', response.token);
            localStorage.setItem("role", response.role);
            
            // Check for password change requirement
            if (response.requirePasswordChange) {
              // Store email to identify user for password change
              localStorage.setItem("email", this.myForm.value.email);
              this.router.navigate(['/change-password']);
            } else {
              let stdid = response.id.toString();
              this.router.navigate([`/dashboard/${stdid}`]);
            }
          }
        },
        error: (err) => {
          console.log("Login failed", err);
        }
      });
    } else {
      console.log('Form is invalid!');
    }
  }
  
}
