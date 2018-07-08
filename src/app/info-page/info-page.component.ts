import { Component } from '@angular/core';
import { CurrentCity } from '../shared/services/current-city.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html'
})
export class InfoPageComponent {

  constructor(public currentCity: CurrentCity) { }
}
