import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { mergeMap, switchMap, catchError, delay, filter, map, retryWhen, take } from 'rxjs/operators';


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

  private rawRequest<T>(path: string, token: string, params?: {}): Observable<HttpResponse<T>> {
    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get<T>(url, {
      params: this.objectToParams(params),
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
      }),
      observe: 'response'
    }).pipe(
      // Automatically retry throttling failures
      retryWhen(error => {
        return error.pipe(
          mergeMap<HttpResponse<T>, HttpResponse<T>>((response: HttpResponse<T>) => {
              if (response.status  === 429) {
                const wait = response.headers['Retry-After'];
                // 429 means we're being throttled, wait 10s and retry
                return of(response).pipe(delay(+wait * 1000));
              }
              return throwError(response);
          }),
          take(5)
        );
      }),
    );
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
      // Don't send a request until the user is authenticated
      filter(token => token !== null),
      switchMap<string, HttpResponse<T>>(token => this.rawRequest<T>(path, token, params)),
      catchError<HttpResponse<T>, HttpResponse<T>>(response => {
        // If we get a 401 error, clear our API token so the user will be prompted to enter it again
        if (response.status === 401) {
          this.logout();
        }
        return of(response);
      }),
      map(response => {
        // Calling function wants to get back a T, not HttpResponse<T>
        return response.body;
      })
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
