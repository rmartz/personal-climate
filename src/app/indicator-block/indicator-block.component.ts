import { Component, Input } from '@angular/core';
import { IndicatorData } from '../shared/models/indicator-data.model';

@Component({
  selector: 'app-indicator-block',
  templateUrl: './indicator-block.component.html'
})
export class IndicatorBlockComponent {

  @Input()
  indicators: IndicatorData[];

  public show_content = true;

  constructor() { }

  public toggle() {
    this.show_content = !this.show_content;
  }

  public loaded() {
    return this.indicators.length > 0 && this.indicators.every(val => val !== undefined);
  }

}
