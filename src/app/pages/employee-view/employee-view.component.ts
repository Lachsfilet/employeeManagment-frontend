import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../services/employee/employee.service';
import {Employee} from '../../interfaces/employee';
import {BehaviorSubject, map, Observable, of, switchMap, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {catchError} from 'rxjs/operators';
import {CreateComponent} from '../../components/create/create.component';


@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  imports: [
    AsyncPipe,
    CreateComponent,
  ],
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent {
  employeeId: number
  reloadSubject = new BehaviorSubject<void>(void 0);
  @ViewChild(CreateComponent) createComponent: CreateComponent;
  stateSubject = new BehaviorSubject<ViewState>(ViewState.VIEWING);
  state$: Observable<ViewState>

  employee$: Observable<Employee>;

  constructor(private route: ActivatedRoute, protected router: Router, private employeeService: EmployeeService) {
    this.state$ = this.stateSubject.asObservable();

    this.employee$ = this.reloadSubject.pipe(
      switchMap(() => this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => this.employeeService.getEmployeeById(id).pipe(
          catchError(() => {
            this.router.navigate(['/404']);
            return of(null);
          })
        )),
        tap(employee => {
          if (employee) {
            this.employeeId = employee.id;
          }
        })
      ))
    )
  }

  updateStateSubject(state: ViewState): void {
    this.reloadSubject.next()
    this.stateSubject.next(state);
  }

  changeState(): void {
    const currentState = this.stateSubject.value;
    if (currentState === ViewState.EDITING) {
      this.createComponent.form.reset();
    }
    this.stateSubject.next(currentState === ViewState.VIEWING ? ViewState.EDITING : ViewState.VIEWING);
  }

  protected readonly ViewState = ViewState;
}


export enum ViewState {
  EDITING = "EDITING",
  VIEWING = "VIEWING"
}
