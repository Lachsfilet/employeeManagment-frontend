import {Component, computed, Signal} from '@angular/core';
import {TodoService} from '../../services/todo/todo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, map, Observable, of, switchMap, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AsyncPipe, NgClass} from '@angular/common';
import {Todo} from '../../interfaces/todo';
import {MatListModule} from '@angular/material/list';
import {MatDialog} from '@angular/material/dialog';
import {AlertComponent, DialogType} from '../../components/alert/alert.component';
import {CreateTodoAlertComponent} from '../../components/create-todo-alert/create-todo-alert.component';
import {toSignal} from '@angular/core/rxjs-interop';

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
  completedTodos: Signal<Todo[]>;
  dueTodos: Signal<Todo[]>;
  employeeId: number;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.todos$ = this.reloadSubject.pipe(
      switchMap(() => {
        return this.route.params.pipe(
          map(params => +params['id']),
          tap(employeeId => this.employeeId = employeeId),
          switchMap((id: number) => this.todoService.getAllTodosByEmployeeId(id))
        );
      })
    );
    const todoSignal = toSignal(this.todos$)
    this.completedTodos = computed(() => todoSignal().filter(todo => todo.completed))
    this.dueTodos = computed(() => todoSignal().filter(todo => !todo.completed))
  }

  markTodo(id: number, completed: boolean) {
    const desc = completed ? "Are you sure you want to mark this Todo as done?" : "Are you sure you want to mark this Todo as incomplete?"
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

  deleteTodo(todo: Todo) {
    this.dialog.open(AlertComponent, {
      data: {
        dialogType: DialogType.CUSTOM,
        message: 'Are you sure you want to delete this Todo?',
        title: `⚠️ Remove ${todo.title}`,
        buttonText: 'Delete',
        buttonAction: true
      }
    }).afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.todoService.deleteTodoById(todo.id)
        }
        return of(null)
      })
    ).subscribe(() => this.reloadSubject.next())
  }

  createTodo() {
    console.log(this.employeeId)
    this.dialog.open(CreateTodoAlertComponent, {
      data: {
        employeeId: this.employeeId
      }
    }).afterClosed().subscribe(() => this.reloadSubject.next())
  }
}
