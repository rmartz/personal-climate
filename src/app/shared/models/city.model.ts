export class ApiCity {
  id: number;
  properties: {name: string, admin: string};
}

export class ApiCityResponse {
  type: string;
  count: number;
  next: string;
  previous: string;
  features: Array<ApiCity>;
}

export class City {
  id: number;
  name: string;
  state: string;

  static fromApi(apiResponse: ApiCity) {
    const city = new City();
    Object.assign(city, {
      'id': apiResponse.id,
      'name': apiResponse.properties.name,
      'state': apiResponse.properties.admin
    });
    return city;
  }
}
