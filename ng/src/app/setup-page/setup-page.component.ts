import { Component } from '@angular/core';
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs,
    Response, URLSearchParams } from '@angular/http';
import { ApiHttp } from '../shared/services/api-http.service'

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html'
})
export class SetupPageComponent {

  public token: String = ""
  public tokenValid: Boolean;
  public nearestCities: Array<any> = [];

  constructor(protected apiHttp: ApiHttp) { }

  public verifyApiToken() {
    this.apiHttp.setToken(this.token);
    this.apiHttp.request('/api/dataset/').subscribe(() => {
        this.tokenValid = true;
    });
  }

  public findNearestCities() {
    this.nearestCities = undefined;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const path = `/api/city/nearest?lat=${lat}&lon=${lon}&limit=5`
      this.apiHttp.request(path).subscribe(response => {
        this.nearestCities = response.json().features.map(city => {
          return {
            'id': city.id,
            'name': city.properties.name,
            'state': city.properties.admin
          }
        });
      });
    });
  }
}
