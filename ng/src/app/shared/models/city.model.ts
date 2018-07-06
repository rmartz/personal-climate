export class City {
  id: number;
  name: string;
  state: string;

  static fromApi(json) {
    const city = new City();
    Object.assign(city, {
      'id': json.id,
      'name': json.properties.name,
      'state': json.properties.admin
    });
    return city;
  }
}
