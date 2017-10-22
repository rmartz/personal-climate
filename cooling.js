var cooling_degree_days = city_promise.then(function(city) {
    return make_indicator_request(city.id, 'cooling_degree_days',
        {
            basetemp: 74,
            basetemp_units: 'F'
        });
}).then(average_by_decade);


window.addEventListener('load', function () {
    var cooling_costs = new Vue({
        el: '#cooling',
        data: {
            basetemp: 74,
            units: 'F',
            future_decade: 2050,
            change_ratio: undefined
        },
        mounted: function () {
            var vm = this;
            console.log("Loading CDD dynamic values");
            cooling_degree_days.then(function(decades) {
                var current = decades[2010];
                var future = decades[vm.future_decade];
                vm.change_ratio = future / current;
                console.log("Cooling ratio is " + vm.change_ratio)
            });
        }
    });
})
