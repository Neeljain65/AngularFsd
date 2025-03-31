import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-login',
  standalone: false,
  
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css'
})
export class StudentLoginComponent {
 myForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router , private authService: AuthService) {
    this.myForm = this.fb.group({
      // name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    
    });
  }

  submitLogin() {
    if (this.myForm.valid) {
      console.log('Login Data:', this.myForm.value);
      this.authService.loginStudent(this.myForm.value).subscribe(
        {
          next:(response: any) => {
            console.log("res",response);
            if(response)
            {
              localStorage.setItem('token', response);
              
            }
          }
        }
      )
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Form is invalid!');
    }
  }
}
