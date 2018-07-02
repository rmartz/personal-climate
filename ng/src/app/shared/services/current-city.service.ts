import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { City } from '../models/city.model'

@Injectable()
export class CurrentCity {

  cityObserver = new BehaviorSubject<City>(undefined);

  constructor() { }

  public getCurrent() {
    return this.cityObserver.asObservable()
  }

  public setCity(city: City) {
    this.cityObserver.next(city);
  }
}
