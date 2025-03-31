import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LandingComponent } from './layout/landing/landing.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, LandingComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, LandingComponent, HeaderComponent],
})
export class CoreModule {}
