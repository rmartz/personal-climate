import { Component, OnInit } from '@angular/core';
import { ApiHttp } from '../shared/services/api-http.service'

@Component({
  selector: 'app-token-config',
  templateUrl: './token-config.component.html'
})
export class TokenConfigComponent implements OnInit {

  public token: string;
  public tokenValid: Boolean;

  constructor(public apiHttp: ApiHttp) { }

  public saveToken() {
    this.apiHttp.setToken(this.token);
  }

  public ngOnInit() {
    this.apiHttp.currentToken().subscribe(token => {
      this.token = token;
      if (token !== undefined) {
        this.tokenValid = true;
      }
    });
  }
}