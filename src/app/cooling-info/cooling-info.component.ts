import { Component, OnInit } from '@angular/core';
import { ClimateData } from '../shared/services/climate-data.service';
import { IndicatorData } from '../shared/models/indicator-data.model';

@Component({
  selector: 'app-cooling-info',
  templateUrl: './cooling-info.component.html'
})
export class CoolingInfoComponent implements OnInit {

  protected basetemp = 74;
  protected basetempUnits = 'F';
  public cdd: IndicatorData;

  constructor(protected climateData: ClimateData) { }

  ngOnInit() {
    this.climateData.get_indicator_data('cooling_degree_days', {
      basetemp: this.basetemp,
      basetemp_units: this.basetempUnits
    }).subscribe(response => {
      this.cdd = response;
      console.log(response);
    });
  }
}
