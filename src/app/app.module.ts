import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StudentDashboardsModule } from './student-dashboards/student-dashboards.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../auth-interceptor.service';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [AppComponent],
  imports: [  MatDatepickerModule, MatInputModule,MatNativeDateModule,
    NgChartsModule,BrowserModule, CoreModule, AppRoutingModule, StudentDashboardsModule],
  providers: [{provide:HTTP_INTERCEPTORS,  useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
