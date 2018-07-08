import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, switchMap, tap } from 'rxjs/operators';

import { City } from '../shared/models/city.model';
import { ApiHttp } from '../shared/services/api-http.service';
import { CurrentCity } from '../shared/services/current-city.service';
import { CityData } from '../shared/services/city-data.service';

@Component({
  selector: 'app-city-config',
  templateUrl: './city-config.component.html'
})
export class CityConfigComponent implements OnInit {

  public citySuggestions: Array<City>;
  public selectedCity: City;
  @ViewChild('citySearch') citySearch: ElementRef;

  constructor(public apiHttp: ApiHttp,
              public currentCity: CurrentCity,
              public cityData: CityData) { }

  ngOnInit() {
    fromEvent(this.citySearch.nativeElement, 'keyup').pipe(
      map<any, string>(event => event.target.value),
      debounceTime(500),
      tap(() => {
        this.citySuggestions = null;
      }),
      switchMap(value => this.cityData.searchByName(value))
    ).subscribe(response => {
      this.citySuggestions = response.features.map(City.fromApi);
    });
  }

  public findNearestCities() {
    this.citySuggestions = null;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.cityData.nearestCities(lat, lon).subscribe(response => {
        this.citySuggestions = response.features.map(City.fromApi);
      });
    });
  }
}
