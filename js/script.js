$(document).ready(function() {
    //todo read data
    //plot national line
    //selectable by up to 3 vaccines
    //select up to 3 states
    //vaccine is x-axis
    //coverage is y-axis
    //color represents different state

    d3.csv('data/data.csv', function(error, data) {
        for (var i = 1; i < data.length; i++) {
            $('#stateSelect').append($('<option></option>')
                .attr('value', data[i].id)
                .text(data[i].id));
        }

        var labels = Object.keys(data[0]);
        for (var i = 1; i < labels.length; i++) {
            $('#vaccineSelect').append($('<option></option>')
                .attr('value', labels[i])
                .text(labels[i]));
        }

        $('#stateSelect').val(['Alabama', 'Alaska', 'Arizona']);
        $('#vaccineSelect').val(['3+DTaP', '4+DTaP', '3+Polio']);

        var margin = {top: 50, right: 50, bottom: 100, left: 50};

        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        var selectedVaccines = ['3+DTaP', '4+DTaP', '3+Polio'];
        var selectedStates = ['Alabama', 'Alaska', 'Arizona'];
        var selectedData = [];

        var yScale;
        var xStateScale;
        var xVaccineScale;
        var color = d3.scale.category10();

        function filterData() {
            selectedData = [];

            data.forEach(function(d) {
                if ($.inArray(d.id, selectedStates) >= 0) {
                    selectedVaccines.forEach(function(v) {
                        var state_vaccine = {
                            state: d.id,
                            v_name: v,
                            v_value: Number(d[v])
                        };

                        selectedData.push(state_vaccine);
                    });
                }
            });
        }

        var svg = d3.select('#vis').append('svg').attr('width', 960).attr('height', 500);

        var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.right + ")")
            .attr('width', width)
            .attr('height', height);

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var xAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')');

        function setScales(data) {
            var minY = d3.min(data, function(d) {return d.v_value});
            var maxY = d3.max(data, function(d) {return d.v_value});

            yScale = d3.scale.linear().range([height, 0]).domain([0, maxY]);
            xStateScale = d3.scale.ordinal().rangeBands([0, width],.2).domain(selectedStates);
            xVaccineScale = d3.scale.ordinal().rangeRoundBands([0, xStateScale.rangeBand()], 0).domain(selectedVaccines);
        }

        function setAxes() {
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            var xAxis = d3.svg.axis()
                .scale(xStateScale)
                .orient('bottom');

            yAxisLabel.transition().duration(500).call(yAxis);
            xAxisLabel.transition().duration(500).call(xAxis);
        }

        function draw(data) {
            setScales(data);
            setAxes();

            var states = g.selectAll('rect').data(data, function(d) {return d.state + d.v_name + Math.random()});

            states.enter()
                .append('rect')
                .attr('width', xVaccineScale.rangeBand())
                .attr('height', function(d) {return height - yScale(d.v_value)})
                .attr('x', function(d) {return xStateScale(d.state) + xVaccineScale(d.v_name)})
                .attr('y', function(d) {return yScale(d.v_value)})
                .attr('fill', function(d) {return color(d.v_name)})
                .attr('title', function(d) {return d.state + d.v_name});


            states.exit().remove();
        }

        $('#stateSelect').change(function() {
            selectedStates = [];

            $('#stateSelect option:selected').each(function() {
                selectedStates.push($(this).text());
            });

            filterData();
            draw(selectedData);
        });

        $('#vaccineSelect').change(function() {
            selectedVaccines = [];

            $('#vaccineSelect option:selected').each(function() {
                selectedVaccines.push($(this).text());
            });

            filterData();
            draw(selectedData);
        });

        filterData();
        draw(selectedData);
    });


});