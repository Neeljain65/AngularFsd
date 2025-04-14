import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboardsModule } from './student-dashboards.module';

describe('student-dashboardsComponent', () => {
  let component: StudentDashboardsModule;
  let fixture: ComponentFixture<StudentDashboardsModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDashboardsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDashboardsModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
