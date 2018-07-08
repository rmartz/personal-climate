import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, filter, tap } from 'rxjs/operators';
import { ClimateData } from '../shared/services/climate-data.service';
import { IndicatorData } from '../shared/models/indicator-data.model';
import { City } from '../shared/models/city.model';
import { CurrentCity } from '../shared/services/current-city.service';

@Component({
  selector: 'app-hot-days',
  templateUrl: './hot-days.component.html'
})
export class HotDaysComponent implements OnInit {

  public hottest_n = 10;
  public static_percentile: IndicatorData;
  public current_threshold: IndicatorData;
  public future_threshold: IndicatorData;

  constructor(protected currentCity: CurrentCity,
              protected climateData: ClimateData) { }

  ngOnInit() {
    const subscription = this.currentCity.getCurrent().pipe(
      tap(() => {
        this.static_percentile = undefined;
        this.current_threshold = undefined;
        this.future_threshold = undefined;
      }),
      filter(city => city !== undefined),
      switchMap<City, Observable<IndicatorData[]>>(city => {
        // We need to store the percentile observer, since the two threshold indicators depend on
        // its value below
        const percentile_observable = this.climateData.get_indicator_data(city, 'percentile_high_temperature', {
            percentile: Math.floor(100.0 * (365.0 - this.hottest_n) / 365.0)
          });
        return combineLatest(
          percentile_observable.pipe(
            tap(response => {
              this.static_percentile = response;
            })
          ),
          // Number of days that will exceed the current Top N temperature
          percentile_observable.pipe(
            switchMap<IndicatorData, IndicatorData>(response => {
              return this.climateData.get_indicator_data(city, 'max_temperature_threshold', {
                threshold: response.future,
                threshold_units: 'F',
                threshold_comparator: 'gte'
              });
            }),
            tap(response => {
              this.future_threshold = response;
            })
          ),
          // Number of days that currently exceed the projected future Top N temperature
          percentile_observable.pipe(
            switchMap<IndicatorData, IndicatorData>(response => {
              return this.climateData.get_indicator_data(city, 'max_temperature_threshold', {
                threshold: response.current,
                threshold_units: 'F',
                threshold_comparator: 'gte'
              });
            }),
            tap(response => {
              this.current_threshold = response;
            })
          ),
        );
      }),
    ).subscribe();
  }
}
