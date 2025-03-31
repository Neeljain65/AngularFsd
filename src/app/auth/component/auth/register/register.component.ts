import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // registrationForm = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   phone: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern('^[0-9]{10}$'),
  //   ]),
  //   password: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(6),
  //   ]),
  //   confirmPassword: new FormControl('', [Validators.required]),
  // });
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registrationForm = this.fb.group(
      {
      
        email: ['', [Validators.required, Validators.email]],
     
        
        password: ['', [Validators.required, Validators.minLength(6)]],
      
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  submitRegistration() {
    if (this.registrationForm.valid) {
      console.log('Registration Successful:', this.registrationForm.value);
      this.authService.registerUser(this.registrationForm.value).subscribe(
        {
          next:(response: any) => {
            console.log(response);
            if(response && response.token)
            {
              localStorage.setItem('token', response.token);
              
            }
          }
        }
      )
      this.router.navigate(['/auth/login']);
      
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
