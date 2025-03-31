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
  pristineImage: boolean = true
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
    if (this.employeeId) {
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
    this.dialog.open(AlertComponent, {
      data: {
        dialogType: type,
        message: message,
        title: type === DialogType.SUCCESS ? "Success" : type === DialogType.ERROR ? "Error" : "Warning"
      }
    });
  }

  createEmployee(employee: Employee): void {
    this.subs.add(
      this.employeeService.createEmployee(employee).subscribe(() => {
        this.openDialog(DialogType.SUCCESS, "Successfully Created User");
        this.router.navigate(['/']);
      })
    );
  }

  updateEmployee(employee: Employee): void {
    this.subs.add(
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.updateStateSubject.emit(ViewState.VIEWING)
        this.reloadSubject.next();
      })
    )
  }

  submitForm(): void {
    const employee = this.form.value as Employee;
    if (this.form.invalid) {
      this.openDialog(DialogType.ERROR, "Please fill out all required Fields or check your email address.");
      return;
    }
    if (!employee.image && !this.imageModalOpened) {
      this.subs.add(
        this.dialog.open(AlertComponent, {
          data: {
            dialogType: DialogType.WARNING,
            message: "Are you sure you want to submit without a picture? You can add one by clicking on the default picture.",
            title: "Warning"
          }
        }).afterClosed().subscribe(() => this.imageModalOpened = true)
      );
      return;
    }
    this.stateSubject.value === FormType.CREATE ? this.createEmployee(employee) : this.updateEmployee(employee);
  }

  uploadWorksheet(event) {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      this.openDialog(DialogType.ERROR, "Please upload an Excel file with the extension .xlsx or .xls");
      return;
    }
    this.subs.add(
      this.employeeService.uploadEmployee(file).subscribe(() => {
        this.openDialog(DialogType.SUCCESS, "Successfully Created Users from Worksheet");
        this.router.navigate(['/']);
      }));
  }

  uploadProfilePicture(event) {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop();
    if (!["png", "jpg", "jpeg"].includes(fileExtension)) {
      this.openDialog(DialogType.ERROR, "Please upload a picture with the extension .png, .jpg, or .jpeg");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({image: reader.result.toString()})
      this.pristineImage = false
    }
  }

  abortEdit() {
    if (this.form.dirty || !this.pristineImage) {
      this.subs.add(
        this.dialog.open(AlertComponent, {
          data: {
            dialogType: DialogType.WARNING,
            message: "You have unsaved changes! If you leave, your changes will be lost.",
            buttonText: "Abort",
            extraButton: true,
            extraButtonText: "Save"
          }
        }).afterClosed().subscribe(res => {
          if (res) {
            this.submitForm()
          } else {
            this.updateStateSubject.emit(ViewState.VIEWING)
          }
        }))
    } else {
      this.updateStateSubject.emit(ViewState.VIEWING)
    }
  }

  protected readonly ViewState = ViewState;
  protected readonly FormType = FormType;
}

enum FormType {
  CREATE = "CREATE",
  UPDATE = "UPDATE"
}
