import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewComponentComponent } from './report-view-component.component';

describe('ReportViewComponentComponent', () => {
  let component: ReportViewComponentComponent;
  let fixture: ComponentFixture<ReportViewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportViewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
