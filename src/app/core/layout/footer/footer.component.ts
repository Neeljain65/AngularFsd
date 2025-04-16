import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  // Footer links
  quickLinks = [
    { name: 'Home', path: '#home' },
    { name: 'Services', path: '#services' },
    { name: 'About Us', path: '#about' },
    { name: 'FAQ', path: '#faq' }
  ];
  
  // Services offered
  services = [
    { name: 'Online Courses', path: '#services' },
    { name: 'Live Training', path: '#services' },
    { name: 'Certifications', path: '#services' },
    { name: 'Community Support', path: '#services' }
  ];
  
  // Social media links
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' }
  ];
  
  // Contact information
  contactInfo = {
    email: 'contact@trainingportal.com',
    phone: '+1 (555) 123-4567',
    address: '123 Education St, Learning City, 12345'
  };
  
  ngOnInit() {
    // Any initialization logic can go here
  }
  
  // Method to submit the newsletter form
  subscribeToNewsletter(email: string) {
    console.log('Newsletter subscription requested for:', email);
    // Add API call to handle newsletter subscription
  }
}
