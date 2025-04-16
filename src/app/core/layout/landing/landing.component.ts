import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  title = 'Training Portal';
  today = new Date();
  price = 7500;
  percentage = 0.85;
  
  // Mock data for landing page stats
  stats = {
    studentsCount: 5000,
    trainersCount: 50,
    coursesCount: 120,
    successRate: 95
  };
  
  // Services offered
  services = [
    {
      icon: '📚',
      title: 'Online Courses',
      description: 'Access our library of courses anytime, anywhere. Learn at your own pace with our comprehensive curriculum.'
    },
    {
      icon: '🎓',
      title: 'Live Training',
      description: 'Join interactive live sessions with industry experts and get real-time feedback on your progress.'
    },
    {
      icon: '🏅',
      title: 'Certification',
      description: 'Earn recognized certifications that boost your resume and validate your skills in the job market.'
    },
    {
      icon: '👥',
      title: 'Community Support',
      description: 'Connect with fellow learners, share experiences, and grow together in our supportive community.'
    }
  ];
  
  // Method to calculate years (for "founded in year X")
  getFoundingYear(): number {
    return new Date().getFullYear() - 5;
  }
}
