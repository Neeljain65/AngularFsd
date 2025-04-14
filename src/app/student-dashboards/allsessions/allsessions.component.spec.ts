import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsessionsComponent } from './allsessions.component';

describe('AllsessionsComponent', () => {
  let component: AllsessionsComponent;
  let fixture: ComponentFixture<AllsessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllsessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllsessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
