import {Component, OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {EmployeeService} from './services/employee/employee.service';
import {AlertComponent, DialogType} from './components/alert/alert.component';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'Employee Management';
  subs = new Subscription()

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
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

  openDialog() {
    this.dialog.open(AlertComponent, {
      data: {
        dialogType: DialogType.SUCCESS,
        message: "Successfully Created 8 Users",
        title: "Success"
      }
    });
  }
}
