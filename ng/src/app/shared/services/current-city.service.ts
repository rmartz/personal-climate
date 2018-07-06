import { Injectable } from '@angular/core';

import { City } from '../models/city.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrentCity {

  cityObserver: BehaviorSubject<City>;

  constructor() {
    let city: City = undefined;
    const json = localStorage.getItem('city');
    if (json !== undefined) {
      city = JSON.parse(json);
    }
    this.cityObserver = new BehaviorSubject<City>(city);
  }

  public getCurrent(): Observable<City> {
    return this.cityObserver.asObservable();
  }

  public currentCityValid(): Observable<boolean> {
    return this.getCurrent().pipe(
      map(city => city !== undefined)
    );
  }

  public setCity(city: City) {
    localStorage.setItem('city', JSON.stringify(city));
    this.cityObserver.next(city);
  }
}
