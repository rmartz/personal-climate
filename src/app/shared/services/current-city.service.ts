import { Injectable } from '@angular/core';

import { City } from '../models/city.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrentCity {

  cityObserver = new BehaviorSubject<City>(undefined);

  constructor() { }

  public getCurrent(): Observable<City> {
    return this.cityObserver.asObservable();
  }

  public setCity(city: City) {
    this.cityObserver.next(city);
  }
}
