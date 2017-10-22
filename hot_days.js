var percentile_by_decade = city_promise.then(function(city) {
    return make_indicator_request(city.id, 'percentile_high_temperature',
        {
            units: temperature_unit,
            percentile: 99
        });
}).then(average_by_decade);
var hot_days_count = Promise.all([city_promise, percentile_by_decade])
    .then(function(responses) {
        var [city, decades] = responses;
        var current = decades[2010];
        return make_indicator_request(city.id, 'max_temperature_threshold',
            {
                threshold: current,
                threshold_units: temperature_unit,
                threshold_comparator: 'gt'
            });
    }).then(average_by_decade);

window.addEventListener('load', function () {
    var hot_day_growth = new Vue({
        el: '#hot_days',
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
