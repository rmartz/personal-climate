import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { City } from '../models/city.model'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrentCity {

  cityObserver = new BehaviorSubject<City>(undefined);

  constructor() { }

  public getCurrent(): Observable<City> {
    return this.cityObserver.asObservable();
  }

  public currentCityValid(): Observable<boolean> {
    return this.getCurrent().map(city => city !== undefined);
  }

  public setCity(city: City) {
    this.cityObserver.next(city);
  }
}
