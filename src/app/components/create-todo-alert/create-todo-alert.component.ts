import {Component, Inject, OnDestroy} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {TodoService} from '../../services/todo/todo.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-create-tod-alert',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule
  ],
  templateUrl: './create-todo-alert.component.html',
  styleUrl: './create-todo-alert.component.css'
})
export class CreateTodoAlertComponent implements OnDestroy {
  todo: FormControl<string> = new FormControl('')
  employeeId: number
  subs = new Subscription()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private todoService: TodoService) {
    this.employeeId = data.employeeId
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  createTodo() {
    this.subs.add(
      this.todoService.createTodo({
        title: this.todo.value,
        completed: false,
        employeeId: this.employeeId
      }).subscribe()
    )
  }
}
