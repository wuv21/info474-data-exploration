$(document).ready(function() {
    //todo read data
    //plot national line
    //selectable by up to 3 vaccines
    //select up to 3 states
    //vaccine is x-axis
    //coverage is y-axis
    //color represents different state

    d3.csv('data/data.csv', function(error, data) {
        console.log(data);

        var margin = {top: 50, right: 50, bottom: 100, left: 50};

        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var selectedVaccines = ["3+DTaP", "4+DTaP"];
        var selectedStates = ['Alabama', 'Arkansas', 'Alaska'];

        var yScale;
        var xStateScale;
        var xVaccineScale;

        var svg = d3.select('#vis').append('svg').attr('width', 960).attr('height', 500);

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var xAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')');

        function setScales(data) {
            var ids = data.map(function(d) {return d.id});
            var minY = d3.min(data, function(d) {
                var val = d[selectedVaccines[0]];
                for (var vac in selectedVaccines) {
                    if (d[vac] < val) {
                        val = d[vac];
                    }
                }
                return val;
            });
            var maxY = d3.max(data, function(d) {
                var val = d[selectedVaccines[0]];
                for (var vac in selectedVaccines) {
                    if (d[vac] > val) {
                        val = d[vac];
                    }
                }
                return val;
            });

            yScale = d3.scale.linear().range([height, 0]).domain([minY, maxY]);
            xStateScale = d3.scale.ordinal().rangeBands([0, width],.2).domain(selectedStates);
            xVaccineScale = d3.scale.ordinal().rangeRoundBands([0, xStateScale.rangeBand()], .2).domain(selectedVaccines);
        }

        function setAxes() {
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            var xAxis = d3.svg.axis()
                .scale(xStateScale)
                .orient('bottom');

            yAxisLabel.transition().duration(2000).call(yAxis);
            xAxisLabel.transition().duration(2000).call(xAxis);
        }

        function draw() {
            setScales(data);
            setAxes();

            var state = svg.selectAll(".state")
                .data(data).enter()
                .append('rect')
                .attr("width", )
        }

        draw();
    });


});