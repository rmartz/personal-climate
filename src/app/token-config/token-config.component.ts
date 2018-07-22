import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHttp } from '../shared/services/api-http.service';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-token-config',
  templateUrl: './token-config.component.html'
})
export class TokenConfigComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  public token: string;

  constructor(public apiHttp: ApiHttp) { }

  public saveToken() {
    this.apiHttp.setToken(this.token);
  }

  public ngOnInit() {
    this.apiHttp.currentToken().subscribe(token => {
      this.token = token;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
