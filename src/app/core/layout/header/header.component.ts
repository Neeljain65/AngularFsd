import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Input()
  title: string = '';
  
  isMobileMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  username: string = '';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Try to get username from localStorage if available
    this.username = localStorage.getItem('username') || 'User';
  }
  
  get isLoggedIn() {
    return localStorage.getItem('token') !== null && localStorage.getItem('token') !== 'undefined';
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigate(['/auth/login']);
  }
  
  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close user menu if open
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  getUserInitials(): string {
    if (!this.username) return 'U';
    return this.username.charAt(0).toUpperCase();
  }
  
  getUsername(): string {
    return this.username || 'User';
  }
  
  // Close menus when clicking outside
  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isUserMenuOpen = false;
  }
}
