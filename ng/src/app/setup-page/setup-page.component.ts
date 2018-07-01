import { Component } from '@angular/core';
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs,
    Response, URLSearchParams } from '@angular/http';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html'
})
export class SetupPageComponent {

  public token: String = ""
  public tokenValid: Boolean;

  constructor(protected http: Http) { }

  public verifyApiToken() {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + this.token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com/api/dataset/'
    this.http.get(url, options).subscribe(() => {
        this.tokenValid = true;
    })
  }
}
