import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiHttp {

  public token: String

  constructor(protected http: Http) { }

  public request(path: String): Observable<Response> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + this.token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get(url, options)
  }

  public setToken(token: String) {
    this.token = token;
  }
}
