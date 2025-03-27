import {Routes} from '@angular/router';
import {WildcardComponent} from './pages/wildcard/wildcard.component';
import {EmployeeViewComponent} from './pages/employee-view/employee-view.component';
import {EmployeeOverviewComponent} from './pages/employee-overwiew/employee-overview.component';
import {CreateEmployeeComponent} from './pages/create-employee/create-employee.component';
import {TodoOverviewComponent} from './pages/todo-overview/todo-overview.component';

export const routes: Routes = [
  {path: '', component: EmployeeOverviewComponent},
  {path: 'create', component: CreateEmployeeComponent},
  {path: 'employee/:id', component: EmployeeViewComponent},
  {path: 'employee/todos/:id', component: TodoOverviewComponent},
  {path: '**', component: WildcardComponent},
];
