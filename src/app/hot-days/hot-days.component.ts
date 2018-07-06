import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ClimateData } from '../shared/services/climate-data.service';
import { IndicatorData } from '../shared/models/indicator-data.model';

@Component({
  selector: 'app-hot-days',
  templateUrl: './hot-days.component.html'
})
export class HotDaysComponent implements OnInit {

  protected hottest_n = 10;
  protected static_percentile: IndicatorData;
  protected current_threshold: IndicatorData;
  protected future_threshold: IndicatorData;

  constructor(protected climateData: ClimateData) { }

  ngOnInit() {
    const percentile = this.climateData.get_indicator_data('percentile_high_temperature', {
      percentile: Math.floor(100.0 * (365.0 - this.hottest_n) / 365.0)
    }).pipe(
      tap(response => {
        // How hot will the hottest N days of each year be?
        this.static_percentile = response;
        console.log(response);
      })
    );

    // Use that to see how many days will be hotter than the hottest N days currently
    percentile.pipe(
      switchMap(response => {
        return this.climateData.get_indicator_data('max_temperature_threshold', {
          threshold: response.current,
          threshold_units: 'F',
          threshold_comparator: 'gte'
        });
      })
    ).subscribe(response => {
      this.current_threshold = response;
      console.log(response);
    });

    // Also see how many days currently can get hotter than the future hottest N days
    percentile.pipe(
      switchMap(response => {
        return this.climateData.get_indicator_data('max_temperature_threshold', {
          threshold: response.future,
          threshold_units: 'F',
          threshold_comparator: 'gte'
        });
      })
    ).subscribe(response => {
      this.future_threshold = response;
      console.log(response);
    });
  }
}
