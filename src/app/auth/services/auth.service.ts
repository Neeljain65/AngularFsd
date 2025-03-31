import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IRegister {
  name: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  registerUser(user: IRegister){
    return this.httpClient.post('/api/auth/register', user);
  }
  loginUser(user : IRegister): Observable<any> {
    return this.httpClient.post('api/auth/login', user);
  }
  loginStudent  (user : IRegister): Observable<any> {
    return this.httpClient.post('api/auth/student', user);
  }
}
