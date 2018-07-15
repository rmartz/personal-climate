export class ApiIndicatorResponse {
  data: { [year: string]: {'avg': number} };
  units: string;
  indicator: {'name': string, 'label': string};
}

export class IndicatorData {
  current_era = 2010;
  future_era = 2050;
  era_length = 10;

  current: number;
  future: number;
  units: string;

  name: string;
  label: string;
  aggregation: string;

  static fromApi(apiResponse: ApiIndicatorResponse): IndicatorData {
    const result = new IndicatorData();
    result.current = result.average_era(apiResponse, result.current_era, result.era_length);
    result.future = result.average_era(apiResponse, result.future_era, result.era_length);

    result.units = apiResponse.units;

    result.name = apiResponse.indicator.name;
    result.label = apiResponse.indicator.label;
    return result;
  }

  private average_era(data: ApiIndicatorResponse, era_start: number, era_length: number): number {
    let sum = 0.0;
    const era_end = era_start + era_length;
    for (let i = era_start; i < era_end; i++) {
      sum += data.data['' + i].avg;
    }
    return sum / era_length;
  }
}
