import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiHttp {

  public token: string

  constructor(protected http: Http) {
    this.token = localStorage.getItem('token');
  }

  public request(path: string): Observable<Response> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + this.token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get(url, options)
  }

  public getToken(): string {
    return this.token;
  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }
}
