import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ApiHttp {

  protected tokenObserver = new BehaviorSubject<string>(undefined);

  constructor(protected http: Http) {
    const savedToken = localStorage.getItem('token');
    // Use setToken so we verify the token works before notifying subscribers
    this.setToken(savedToken);
  }

  private rawRequest(path: string, token: string): Observable<Response> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get(url, options)
  }

  public currentToken(): Observable<string> {
    return this.tokenObserver.asObservable();
  }

  public request(path: string): Observable<Response> {
    return this.currentToken().flatMap(token => {
      return this.rawRequest(path, token);
    }).pipe(first());
  }

  private testTokenValidity(token: string): Observable<boolean> {
    const path = '/api/dataset/';
    return this.rawRequest(path, token).pipe(map(() => {
      return true;
    }));
  }

  public setToken(token: string) {
    this.testTokenValidity(token).subscribe(valid => {
      localStorage.setItem('token', token);
      this.tokenObserver.next(token);
    })
  }
}
