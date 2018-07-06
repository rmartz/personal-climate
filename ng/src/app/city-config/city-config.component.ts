import { Component } from '@angular/core';
import { City } from '../shared/models/city.model';
import { ApiHttp } from '../shared/services/api-http.service';
import { CurrentCity } from '../shared/services/current-city.service';

@Component({
  selector: 'app-city-config',
  templateUrl: './city-config.component.html'
})
export class CityConfigComponent {

  public nearestCities: Array<any> = [];
  public selectedCity: City;

  constructor(protected apiHttp: ApiHttp,
              protected currentCity: CurrentCity) { }

  public findNearestCities() {
    this.nearestCities = undefined;
    this.selectedCity = undefined;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const path = `/api/city/nearest/?lat=${lat}&lon=${lon}&limit=5`;
      this.apiHttp.request(path).subscribe(response => {
        this.nearestCities = response.json().features.map(apiCity => {
          const city = new City();
          Object.assign(city, {
            'id': apiCity.id,
            'name': apiCity.properties.name,
            'state': apiCity.properties.admin
          });
          return city;
        });
        this.selectedCity = this.nearestCities[0];
      });
    });
  }

  public save() {
    this.currentCity.setCity(this.selectedCity);
  }
}
