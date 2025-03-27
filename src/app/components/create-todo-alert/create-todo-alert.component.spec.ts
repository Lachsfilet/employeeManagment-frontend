import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTodoAlertComponent } from './create-todo-alert.component';

describe('CreateTodAlertComponent', () => {
  let component: CreateTodoAlertComponent;
  let fixture: ComponentFixture<CreateTodoAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTodoAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTodoAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
