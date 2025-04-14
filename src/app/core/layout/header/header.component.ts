import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input()
  title: string = '';
  constructor(private router: Router) {}
  get isLoggedIn(){
    return localStorage.getItem('token') !== null && localStorage.getItem('token') !== 'undefined';
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
