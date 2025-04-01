import {Component, OnDestroy} from '@angular/core';

import {EmployeeService} from '../../services/employee/employee.service';
import {Employee} from '../../interfaces/employee';
import {Router, RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, of, Subscription, switchMap, tap, timer} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {AlertComponent, DialogType} from '../../components/alert/alert.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-employee-overview',
  imports: [
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './employee-overview.component.html',
  styleUrl: './employee-overview.component.css'
})
export class EmployeeOverviewComponent implements OnDestroy {
  skeletonArray = Array(18)


  reloadSubject = new BehaviorSubject<void>(void 0);
  stateSubject = new BehaviorSubject<EmployeeOverviewState>(EmployeeOverviewState.SKELETON);
  state$: Observable<EmployeeOverviewState>;

  employees$: Observable<Employee[]>;

  subs = new Subscription()

  constructor(private employeeService: EmployeeService, private router: Router, private dialog: MatDialog) {
    this.state$ = this.stateSubject.asObservable();

    this.employees$ = this.reloadSubject.pipe(
      switchMap(() => timer(1000).pipe(
        switchMap(() => this.employeeService.getAllEmployees().pipe(
          catchError(() => of(null)),
        )),
        tap(employees => {
          if (!employees) {
            this.stateSubject.next(EmployeeOverviewState.ERROR);
          } else if (employees.length > 0) {
            this.stateSubject.next(EmployeeOverviewState.DATA);
          } else {
            this.stateSubject.next(EmployeeOverviewState.EMPTY);
          }
        })
      ))
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  deleteEmployee(employee: Employee): void {
    this.subs.add(
      this.dialog.open(AlertComponent, {
        data: {
          dialogType: DialogType.CUSTOM,
          message: 'Are you sure you want to delete this employee and all todos if existing?',
          title: `⚠️ Remove ${employee.firstName} ${employee.lastName}`,
          buttonText: 'Delete',
          buttonAction: true
        }
      }).afterClosed().pipe(
        switchMap((result) => {
          if (result) {
            return this.employeeService.deleteEmployee(employee.id)
          }
          return of(null)
        })
      ).subscribe(() => this.reloadSubject.next())
    )
  }

  downloadEmployees() {
    this.subs.add(
      this.employeeService.downloadEmployees().subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.xlsx';
        a.click()
      })
    );
  }



  protected readonly EmployeeOverviewState = EmployeeOverviewState;
}

enum EmployeeOverviewState {
  SKELETON = 'SKELETON',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
  DATA = 'DATA'
}
