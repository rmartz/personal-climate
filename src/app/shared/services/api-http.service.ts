import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, first, filter, map } from 'rxjs/operators';


@Injectable()
export class ApiHttp {

  protected tokenObserver: BehaviorSubject<string>;

  constructor(protected http: HttpClient) {
    const savedToken = localStorage.getItem('token');
    this.tokenObserver = new BehaviorSubject<string>(savedToken);
  }

  private objectToParams(params: {}): HttpParams {
    let result = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const val = params[key];
        result = result.append(key, val);
      }
    }
    return result;
  }

  private rawRequest<T>(path: string, token: string, params?: {}): Observable<T> {
    const options = {
      params: this.objectToParams(params),
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
      })
    };

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get<T>(url, options);
  }

  public currentToken(): Observable<string> {
    return this.tokenObserver.asObservable();
  }

  public currentTokenValid(): Observable<boolean> {
    return this.currentToken().pipe(
      map(token => token !==  null)
    );
  }

  public logout() {
    localStorage.removeItem('token');
    this.tokenObserver.next(null);
  }

  public request<T>(path: string, params?: {}): Observable<T> {
    return this.currentToken().pipe(
      filter(token => token !== null),
      first(),
      mergeMap<string, T>(token => this.rawRequest<T>(path, token, params))
    );
  }

  private testTokenValidity(token: string): Observable<boolean> {
    const path = '/api/dataset/';
    return this.rawRequest<Object>(path, token).pipe(
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
