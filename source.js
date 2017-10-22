var api_token = "";
var api_base_url = "https://app.climate.azavea.com/api/";
var temperature_unit = 'F'

function getApi(url, params) {
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

    var myRequest = new Request(api_base_url + url + params_string);
    return fetch(myRequest,myInit).then(function(response) {
        return response.json();
    });
}

function getIndicator(city_id, indicator, params) {
    params.agg = 'avg';

    url = 'climate-data/' + city_id + '/RCP85/indicator/' + indicator + '/';
    return getApi(url, params);
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

window.addEventListener('load', function () {
    var city_promise = getApi('city/nearest/',
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
    var percentile_by_decade = city_promise.then(function(city) {
        return getIndicator(city.id, 'percentile_high_temperature',
            {
                units: temperature_unit,
                percentile: 99
            });
    }).then(average_by_decade);
    var hot_days_count = Promise.all([city_promise, percentile_by_decade])
        .then(function(responses) {
            var [city, decades] = responses;
            var current = decades[2010];
            return getIndicator(city.id, 'max_temperature_threshold',
                {
                    threshold: current,
                    threshold_units: temperature_unit,
                    threshold_comparator: 'gt'
                });
        }).then(average_by_decade);


        var hot_day_growth = new Vue({
            el: '#app',
            data: {
                current_hot_threshold: null,
                units: 'F',
                current_hot_days: null,
                future_decade: 2050,
                future_hot_days: null,
                city_name: null
            },
            mounted: function () {
                var vm = this;
                console.log("Loading dynamic values");
                city_promise.then(function(city) {
                    vm.city_name = city.name;
                    console.log("City name is " + vm.city_name)
                })
                percentile_by_decade.then(function(decades) {
                    vm.current_hot_threshold = decades[2010];
                    console.log("Hottest days of summer are " + vm.current_hot_threshold)
                })
                hot_days_count.then(function(hot_days) {
                    vm.current_hot_days = hot_days[2010];
                    vm.future_hot_days = hot_days[vm.future_decade];
                })
            }
        });
})
