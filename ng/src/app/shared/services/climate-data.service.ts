import { Injectable } from '@angular/core';
import { ApiHttp } from './api-http.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';


import { CurrentCity } from './current-city.service'

@Injectable()
export class ClimateData {

  constructor(protected apiHttp: ApiHttp,
              protected currentCity: CurrentCity) { }

  public get_indicator_data(indicator_name, params) {
    const scenario = 'RCP85';

    return this.currentCity.getCurrent().filter(city => {
      // Don't send requests when we don't have a city configured
      return city !== undefined;
    }).mergeMap(city => {
      const path = `/api/climate-data/${city.id}/${scenario}/indicator/${indicator_name}/`
      return this.apiHttp.request(path);
    });
  }
}
