import { Component } from '@angular/core';
import {CreateComponent} from '../../components/create/create.component';

@Component({
  selector: 'app-create-employee',
  imports: [
    CreateComponent
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent {

}
