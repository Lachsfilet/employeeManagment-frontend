import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee/employee.service';
import {Employee} from '../../interfaces/employee';
import {Router} from '@angular/router';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {AlertComponent, DialogType} from '../alert/alert.component';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ViewState} from '../../pages/employee-view/employee-view.component';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    AsyncPipe
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit, OnDestroy {
  @Input() employeeId: number;
  @Output() updateStateSubject = new EventEmitter<ViewState>();
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    image: new FormControl<string | null>(null),
  })

  imageModalOpened: boolean = false;
  stateSubject = new BehaviorSubject<FormType>(FormType.CREATE);
  state$: Observable<FormType>;

  reloadSubject = new BehaviorSubject<void>(void 0);

  private subs = new Subscription();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.state$ = this.stateSubject.asObservable();
  }

  ngOnInit(): void {
    if (!this.employeeId) {
      this.stateSubject.next(FormType.CREATE);
    } else {
      this.stateSubject.next(FormType.UPDATE);
      this.subs.add(
        this.employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
          this.form.patchValue(employee);
        })
      );
    }

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openDialog(type: DialogType, message: string) {
    if (type === DialogType.SUCCESS) {
      this.dialog.open(AlertComponent, {
        data: {
          dialogType: DialogType.SUCCESS,
          message: message,
          title: "Success"
        }
      });
    } else if (type === DialogType.ERROR) {
      this.dialog.open(AlertComponent, {
        data: {
          dialogType: DialogType.ERROR,
          message: message,
          title: "Error"
        }
      });
    }
  }

  createEmployee(employee: Employee): void {
    this.employeeService.createEmployee(employee).subscribe(() => {
      this.openDialog(DialogType.SUCCESS, "Successfully Created User");
      this.router.navigate(['/']);
    });
  }

  updateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(() => {
      this.updateStateSubject.emit(ViewState.VIEWING)
      this.reloadSubject.next();
    });
  }

  submitForm(): void {
    const employee = this.form.value as Employee;
    if (this.form.invalid || !employee.image) {
      if (!employee.image && !this.imageModalOpened) {
        this.dialog.open(AlertComponent, {
          data: {
            dialogType: DialogType.WARNING,
            message: "Are you sure you want to submit without a picture? You can add one by clicking on the default picture.",
            title: "Warning"
          }
        }).afterClosed().subscribe(() => this.imageModalOpened = true);
        return;
      }
      if (this.form.controls['email'].hasError('email')) {
        this.openDialog(DialogType.ERROR, "Please enter a valid email address");
        return;
      }
      if (this.form.hasError('required')) {
        this.openDialog(DialogType.ERROR, "Please fill out all required fields");
        return
      }
    }
    if (this.stateSubject.value === FormType.CREATE) {
      this.createEmployee(employee);
    } else {
      console.log()
      this.updateEmployee(employee);
    }
  }

  uploadWorksheet(event) {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      this.openDialog(DialogType.ERROR, "Please upload an Excel file with the extension .xlsx or .xls");
      return;
    }
    this.employeeService.uploadEmployee(file).subscribe(() => {
      this.openDialog(DialogType.SUCCESS, "Successfully Created Users from Worksheet");
      this.router.navigate(['/']);
    });
  }

  uploadProfilePicture(event) {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop();
    if (fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
      this.openDialog(DialogType.ERROR, "Please upload a picture with the extension .png, .jpg, or .jpeg");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({image: reader.result.toString()})
    }
  }

  protected readonly FormType = FormType;
}

enum FormType {
  CREATE = "CREATE",
  UPDATE = "UPDATE"
}
