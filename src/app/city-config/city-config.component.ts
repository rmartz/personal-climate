import { Component } from '@angular/core';
import { City, ApiCityResponse } from '../shared/models/city.model';
import { ApiHttp } from '../shared/services/api-http.service';
import { CurrentCity } from '../shared/services/current-city.service';

@Component({
  selector: 'app-city-config',
  templateUrl: './city-config.component.html'
})
export class CityConfigComponent {

  public nearestCities: Array<any> = [];
  public selectedCity: City;

  constructor(public apiHttp: ApiHttp,
              public currentCity: CurrentCity) { }

  public findNearestCities() {
    this.nearestCities = undefined;
    this.selectedCity = undefined;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const path = '/api/city/nearest/';
      this.apiHttp.request<ApiCityResponse>(path, {
        lat: lat,
        lon: lon,
        limit: 5
      }).subscribe(response => {
        this.nearestCities = response.features.map(City.fromApi);
        this.selectedCity = this.nearestCities[0];
      });
    });
  }

  public save() {
    this.currentCity.setCity(this.selectedCity);
  }
}
