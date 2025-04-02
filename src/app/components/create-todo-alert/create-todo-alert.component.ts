import {Component, Inject, OnDestroy} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {TodoService} from '../../services/todo/todo.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertComponent, DialogType} from '../alert/alert.component';

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
  todo: FormControl<string> = new FormControl('', Validators.required)
  employeeId: number
  subs = new Subscription()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private todoService: TodoService, private dialog: MatDialog) {
    this.employeeId = data.employeeId
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  createTodo() {
      if(this.todo.invalid) {
        this.dialog.open(AlertComponent, {
          data: {
            title: "Error",
            message: "Please enter a Todo",
            type: DialogType.ERROR
          }
        })
      } else {
        this.subs.add(
          this.todoService.createTodo({
            title: this.todo.value,
            completed: false,
            employeeId: this.employeeId
          }).subscribe()
        )
      }
  }
}
