import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTodAlertComponent } from './create-tod-alert.component';

describe('CreateTodAlertComponent', () => {
  let component: CreateTodAlertComponent;
  let fixture: ComponentFixture<CreateTodAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTodAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTodAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
