import { Response } from '@angular/http';

class ApiIndicatorResponse {
  data: { [year: string]: {avg: number} };

  static fromApi(response: Response): ApiIndicatorResponse {
    const data = new ApiIndicatorResponse()
    Object.assign(data, response.json());
    return data;
  }
}

export class IndicatorData {
  current_era = 2010;
  future_era = 2050;
  era_length = 10;

  current: number;
  future: number;

  static fromApi(response: Response): IndicatorData {
    const raw = ApiIndicatorResponse.fromApi(response);

    const result = new IndicatorData();
    result.current = result.average_era(raw, result.current_era, result.era_length);
    result.future = result.average_era(raw, result.future_era, result.era_length);
    return result;
  }

  private average_era(data: ApiIndicatorResponse, era_start, era_length): number {
    let sum = 0.0;
    const era_end = era_start + era_length;
    for (let i = era_start; i < era_end; i++) {
      sum += data.data['' + i].avg;
    }
    return sum / era_length;
  }
}
