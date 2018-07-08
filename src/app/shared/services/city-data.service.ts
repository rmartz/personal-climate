import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttp } from './api-http.service';
import { ApiCityResponse } from '../models/city.model';

@Injectable()
export class CityData {

  constructor(protected apiHttp: ApiHttp) { }

  public nearestCities(lat: number, lon: number): Observable<ApiCityResponse> {
    const path = '/api/city/nearest/';
    return this.apiHttp.request<ApiCityResponse>(path, {
      lat: lat,
      lon: lon,
      limit: 5
    });
  }

  public searchByName(search: string): Observable<ApiCityResponse> {
    const path = '/api/city/';
    return this.apiHttp.request<ApiCityResponse>(path, {
      search: search,
      limit: 5
    });
  }
}
