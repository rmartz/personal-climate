import { Injectable } from '@angular/core';
import { ApiHttp } from './api-http.service';
import { filter, switchMap, map } from 'rxjs/operators';

import { CurrentCity } from './current-city.service';
import { City } from '../models/city.model';
import { ApiIndicatorResponse, IndicatorData } from '../models/indicator-data.model';

@Injectable()
export class ClimateData {

  constructor(protected apiHttp: ApiHttp,
              protected currentCity: CurrentCity) { }

  public get_indicator_data(indicator_name, params) {
    const scenario = 'RCP85';

    return this.currentCity.getCurrent().pipe(
      // Don't send requests when we don't have a city configured
      filter(city => city !== undefined),
      switchMap<City, ApiIndicatorResponse>(city => {
        const path = `/api/climate-data/${city.id}/${scenario}/indicator/${indicator_name}/`;
        return this.apiHttp.request<ApiIndicatorResponse>(path, params);
      }),
      map(apiResponse => IndicatorData.fromApi(apiResponse))
    );
  }
}
