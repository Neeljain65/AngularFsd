import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StudentDashboardsModule } from './student-dashboards/student-dashboards.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../auth-interceptor.service';


@NgModule({
    declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule, StudentDashboardsModule],
  providers: [{provide:HTTP_INTERCEPTORS,  useClass: AuthInterceptor, multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
