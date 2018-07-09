import { Injectable } from '@angular/core';
import { ApiHttp } from './api-http.service';
import { filter, switchMap, map } from 'rxjs/operators';

import { CurrentCity } from './current-city.service';
import { City } from '../models/city.model';
import { ApiIndicatorResponse, IndicatorData } from '../models/indicator-data.model';
import { IndicatorParams } from '../models/indicator-params.model';

@Injectable()
export class ClimateData {

  constructor(protected apiHttp: ApiHttp,
              protected currentCity: CurrentCity) { }

  public get_indicator_data(city: City, indicator_name: string, params?: IndicatorParams) {
    if (!params) {
      params = {};
    }
    if (!params.years) {
      params.years = '2010:2019,2050:2059';
    }
    if (!params.agg) {
      params.agg = 'avg';
    }
    const scenario = 'RCP85';
    const path = `/api/climate-data/${city.id}/${scenario}/indicator/${indicator_name}/`;
    return this.apiHttp.request<ApiIndicatorResponse>(path, params).pipe(
      map(apiResponse => IndicatorData.fromApi(apiResponse))
    );
  }
}
