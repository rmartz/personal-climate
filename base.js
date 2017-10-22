var api_token = undefined;
var api_base_url = "https://app.climate.azavea.com/";
var temperature_unit = 'F'

function get_api_token(input_form) {

    var formData = new FormData();
    formData.append("email", input_form.email.value);
    formData.append("password", input_form.password.value);

    var myInit = {
        method: 'POST',
        body: formData,
        mode: 'cors',
        cache: 'default'
    };

    var myRequest = new Request(api_base_url + 'api-token-auth/');
    return fetch(myRequest,myInit).then(function(response) {
        return response.json();
    });
}

function make_api_request(url, params) {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Token ' + api_token);

    var myInit = { method: 'GET',
                   headers: myHeaders,
                   mode: 'cors',
                   cache: 'default' };

    var params_string = '';
    if(params) {
        params_string = '?' + $.param(params);
    }

    var myRequest = new Request(api_base_url + 'api/' + url + params_string);
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

var logged_in = new Promise(function(resolve, reject) {
    window.addEventListener('load', function () {
        console.log("Window loaded");
        $("#login_form").submit(function() {
            console.log("Login form submitted");
            return get_api_token(this).then(function(response) {
                console.log(response);
                api_token = response.token;
                resolve(response.token);
            })
        });
    });
});
var city_promise = logged_in.then(function() {
    return make_api_request('city/nearest/',
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
