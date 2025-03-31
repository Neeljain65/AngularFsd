import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,

  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  title = 'welcome to the landing page';
  today = new Date();
  price = 7500;
  percentage = 0.85;
}
