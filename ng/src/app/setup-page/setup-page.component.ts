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
  public nearestCities: Array<any> = [];

  constructor(protected http: Http) { }

  private makeApiRequest(path) {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Token ' + this.token);
    options.headers.set('Accept', 'application/json');

    const url = 'https://app.climate.azavea.com' + path;
    return this.http.get(url, options)
  }

  public verifyApiToken() {
    this.makeApiRequest('/api/dataset/').subscribe(() => {
        this.tokenValid = true;
    });
  }

  public findNearestCities() {
    this.nearestCities = undefined;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `/api/city/nearest?lat=${lat}&lon=${lon}&limit=5`
      this.makeApiRequest(url).subscribe(response => {
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
