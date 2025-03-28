import { Component } from '@angular/core';
import { TodoService } from '../../services/todo/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AsyncPipe, NgClass} from '@angular/common';
import { Todo } from '../../interfaces/todo';
import { MatListModule } from '@angular/material/list';
import {MatDialog} from '@angular/material/dialog';
import {AlertComponent, DialogType} from '../../components/alert/alert.component';
import {CreateTodoAlertComponent} from '../../components/create-todo-alert/create-todo-alert.component';

@Component({
  selector: 'app-todo-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    MatListModule,
    NgClass
  ],
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.css']
})
export class TodoOverviewComponent {
  reloadSubject = new BehaviorSubject<void>(void 0);
  todos$: Observable<Todo[]>;
  completedTodos: Todo[]
  dueTodos: Todo[]
  deleteButtonClicked: boolean;
  employeeId

  constructor(private todoService: TodoService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.todos$ = this.reloadSubject.pipe(
      switchMap(() => {
        return this.route.params.pipe(
          map(params => params['id']),
          switchMap((id) => this.todoService.getAllTodosByEmployeeId(id).pipe(
            tap(todos => {
              this.completedTodos = todos.filter(todo => todo.completed);
              this.dueTodos = todos.filter(todo => !todo.completed);
              if (todos) {
                this.employeeId = todos[0].employeeId
              }
            }),
          ))
        );
      })
    )
  }

  markTodo(id: number, completed: boolean) {
    let desc = completed ? "Are you sure you want to mark this Todo as done?" : "Are you sure you want to mark this Todo as incomplete?"
    if(!this.deleteButtonClicked) {
      this.dialog.open(AlertComponent, {
        data: {
          title: 'Are you sure?',
          message: desc,
          dialogType: DialogType.WARNING,
          extraButton: true,
          extraButtonText: "Yes",
          extraButtonAction: true
        }
      }).afterClosed().pipe(
        switchMap((result: boolean) => {
          if (result) {
            return this.todoService.markTodoAs(id, completed)
          }
          return of(null)
        })
      ).subscribe(() => this.reloadSubject.next())
    }
  }

  deleteTodo(todo: Todo) {
    this.deleteButtonClicked = true
    this.dialog.open(AlertComponent, {
      data: {
        dialogType: DialogType.CUSTOM,
        message: 'Are you sure you want to delete this Todo?',
        title: `⚠️ Remove ${todo.title}`,
        buttonText: 'Delete',
        buttonAction: true
      }}).afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.todoService.deleteTodoById(todo.id)
        }
        this.deleteButtonClicked = false
        return of(null)
      })
    ).subscribe(() => this.reloadSubject.next())
  }

  createTodo() {
    this.dialog.open(CreateTodoAlertComponent, {
      data: {
        employeeId: this.employeeId
      }
    }).afterClosed().subscribe(() => this.reloadSubject.next())
  }
}
