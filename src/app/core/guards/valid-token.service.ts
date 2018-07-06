import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { ApiHttp } from '../../shared/services/api-http.service';

@Injectable()
export class ValidTokenGuard implements CanActivate {

  constructor(private router: Router,
              protected apiHttp: ApiHttp) { }

  canActivate() {
    return this.apiHttp.currentTokenValid().pipe(
      map(valid => {
        if (!valid) {
          this.router.navigate(['/settings/']);
        }
        return valid;
      })
    );
  }
}
