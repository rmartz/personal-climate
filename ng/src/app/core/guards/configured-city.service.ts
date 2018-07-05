import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';

import { CurrentCity } from '../../shared/services/current-city.service';

@Injectable()
export class ConfiguredCityGuard implements CanActivate {

  constructor(private router: Router,
              protected currentCity: CurrentCity) { }

  canActivate() {
    return this.currentCity.currentCityValid().map(valid => {
      if(!valid) {
        this.router.navigate(['/settings/']);
      }
      return valid;
    });
  }
}
