import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../interfaces/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  baseUrl = "https://backend.lachsfilet.tech:8080"

  constructor(private httpClient: HttpClient) {
  }

  createTodo(todo: Todo) {
    return this.httpClient.post(`${this.baseUrl}/todo`, todo);
  }

  getAllTodosByEmployeeId(employeeId: number) {
    return this.httpClient.get<Todo[]>(`${this.baseUrl}/todo/employee/${employeeId}`);
  }

  deleteTodoById(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/todo/${id}`);
  }

  markTodoAs(id: number, markCompletedAs: boolean) {
    return this.httpClient.post(`${this.baseUrl}/todo/${id}?markCompletedAs=${markCompletedAs}`, {})
  }
}
