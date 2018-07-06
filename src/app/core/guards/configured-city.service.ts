import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrentCity } from '../../shared/services/current-city.service';

@Injectable()
export class ConfiguredCityGuard implements CanActivate {

  constructor(private router: Router,
              protected currentCity: CurrentCity) { }

  canActivate(): Observable<boolean> {
    return this.currentCity.currentCityValid().pipe(
      map(valid => {
        if (!valid) {
          this.router.navigate(['/settings/']);
        }
        return valid;
      })
    );
  }
}
