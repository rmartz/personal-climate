var api_token = "";
var api_base_url = "https://app.climate.azavea.com/api/";
var temperature_unit = 'F'

function make_api_request(url, params, method) {
    method = method || "GET";

    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Token ' + api_token);

    var myInit = { method: method,
                   headers: myHeaders,
                   mode: 'cors',
                   cache: 'default' };

    var params_string = '';
    if(params) {
        params_string = '?' + $.param(params);
    }

    var myRequest = new Request(api_base_url + url + params_string);
    return fetch(myRequest,myInit).then(function(response) {
        return response.json();
    });
}

function make_indicator_request(city_id, indicator, params) {
    params.agg = 'avg';

    url = 'climate-data/' + city_id + '/RCP85/indicator/' + indicator + '/';
    return make_api_request(url, params);
}

function average_by_decade(response) {
    // Returns a dictionary of {decade: average}
    var data = _.chain(response.data)
        .toPairs(response.data)
        .groupBy(function(pair) {
            // Collect all yearly records into decades
            return 10 * Math.floor(pair[0] / 10)
        })
        .mapValues(function(decade) {
            // Average each decade over each yearly record
            return _.meanBy(decade, '1.avg');
        }).value();
    console.log(data);
    return data;
}

var city_promise;

window.addEventListener('load', function () {
    city_promise = make_api_request('city/nearest/',
        {
            'lat': 39.9526,
            'lon': -75.1652
        }).then(function(response) {
            var city_json = response.features[0];
            return {
                id: city_json.id,
                name: city_json.properties.name
            };
        });
});
