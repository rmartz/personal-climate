import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap, tap, filter } from 'rxjs/operators';
import { ClimateData } from '../shared/services/climate-data.service';
import { CurrentCity } from '../shared/services/current-city.service';
import { City } from '../shared/models/city.model';
import { IndicatorData } from '../shared/models/indicator-data.model';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-cooling-info',
  templateUrl: './cooling-info.component.html'
})
export class CoolingInfoComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;

  protected basetemp = 74;
  protected basetempUnits = 'F';
  public cdd: IndicatorData;

  constructor(protected currentCity: CurrentCity,
              protected climateData: ClimateData) { }

  ngOnInit() {
    this._subscription = this.currentCity.getCurrent().pipe(
      tap(() => {
        this.cdd = undefined;
      }),
      filter(city => city !== undefined),
      switchMap<City, IndicatorData>(city => {
        return this.climateData.get_indicator_data(city, 'cooling_degree_days', {
          basetemp: this.basetemp,
          basetemp_units: this.basetempUnits
        });
      })
    ).subscribe(response => {
      this.cdd = response;
      console.log(response);
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
