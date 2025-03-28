import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = "https://backend.lachsfilet.tech:8080"

  constructor(private httpClient: HttpClient) {
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.baseUrl}/employee`, employee);
  }

  getAllEmployees() {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/employee`);
  }

  getEmployeeById(id: number) {
    return this.httpClient.get<Employee>(`${this.baseUrl}/employee/${id}`);
  }

  updateEmployee(employee: Employee) {
    return this.httpClient.post(`${this.baseUrl}/employee/${employee.id}`, {
      firstName: employee.firstName,
      lastName: employee.lastName,
      image: employee.image,
      email: employee.email
    });
  }

  deleteEmployee(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/employee/${id}`);
  }

  downloadEmployees() {
    return this.httpClient.get(`${this.baseUrl}/employee/download`, { responseType: 'blob' });
  }

  uploadEmployee(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.baseUrl}/employee/upload`, formData);
  }
}
