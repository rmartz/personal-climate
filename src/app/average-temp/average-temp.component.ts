import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { ClimateData } from '../shared/services/climate-data.service';
import { CurrentCity } from '../shared/services/current-city.service';
import { switchMap, tap } from 'rxjs/operators';
import { IndicatorData } from '../shared/models/indicator-data.model';
import { City } from '../shared/models/city.model';

@Component({
  selector: 'app-average-temp',
  templateUrl: './average-temp.component.html'
})
export class AverageTempComponent implements OnInit {

  public high: IndicatorData;
  public low: IndicatorData;

  constructor(protected currentCity: CurrentCity,
              protected climateData: ClimateData) { }

  ngOnInit() {
    this.currentCity.getCurrent().pipe(
      tap(() => {
        this.high = undefined;
        this.low = undefined;
      }),
      switchMap<City, IndicatorData[]>(city => {
        return zip(
          this.climateData.get_indicator_data(city, 'average_high_temperature'),
          this.climateData.get_indicator_data(city, 'average_low_temperature', {})
        );
      })
    ).subscribe(results => {
      this.high = results[0];
      this.low = results[1];
    });
  }
}
