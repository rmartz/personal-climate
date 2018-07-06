import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, first, filter, map } from 'rxjs/operators';


@Injectable()
export class ApiHttp {

  protected tokenObserver: BehaviorSubject<string>;

  constructor(protected http: Http) {
    const savedToken = localStorage.getItem('token');
    this.tokenObserver = new BehaviorSubject<string>(savedToken);
  }

  private objectToParams(params: {}) {
    const result = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const val = params[key];
        result.set(key, val);
      }
    }
    return result;
  }

  private rawRequest(path: string, token: string, params?: {}): Observable<Response> {
    const options = new RequestOptions();
    options.params = this.objectToParams(params);
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get(url, options);
  }

  public currentToken(): Observable<string> {
    return this.tokenObserver.asObservable();
  }

  public currentTokenValid(): Observable<boolean> {
    return this.currentToken().pipe(
      map(token => token !== undefined)
    );
  }

  public logout() {
    localStorage.removeItem('token');
    this.tokenObserver.next(undefined);
  }

  public request(path: string, params?: {}): Observable<Response> {
    return this.currentToken().pipe(
      filter(token => token !== undefined),
      first(),
      mergeMap<string, Response>(token => this.rawRequest(path, token, params))
    );
  }

  private testTokenValidity(token: string): Observable<boolean> {
    const path = '/api/dataset/';
    return this.rawRequest(path, token).pipe(
      map(() => true)
    );
  }

  public setToken(token: string) {
    this.testTokenValidity(token).subscribe(valid => {
      localStorage.setItem('token', token);
      this.tokenObserver.next(token);
    });
  }
}
