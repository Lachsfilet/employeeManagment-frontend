import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatInput} from '@angular/material/input';
import {TodoService} from '../../services/todo/todo.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-tod-alert',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './create-todo-alert.component.html',
  styleUrl: './create-todo-alert.component.css'
})
export class CreateTodoAlertComponent {
  todo: FormControl<string> = new FormControl('')
  employeeId: number
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private todoService: TodoService) {
    this.employeeId = data.employeeId
  }

  createTodo() {
    this.todoService.createTodo({
      title: this.todo.value,
      completed: false,
      employeeId: this.employeeId
    }).subscribe()
  }
}
