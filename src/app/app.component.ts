import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {EmployeeService} from './services/employee/employee.service';
import {AlertComponent, DialogType} from './components/alert/alert.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Employee Management';

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {

  }

  downloadEmployees() {
    this.employeeService.downloadEmployees().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.xlsx';
      a.click()
    });
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
