// script.js

// references include:
// module 8, exercise 3 for d3 setup
// https://bl.ocks.org/mbostock/3887051 for grouped bar charts and legend
// stackoverflow for dynamic option appending to select element.

$(document).ready(function() {
    // read in data
    d3.csv('data/data.csv', function(error, data) {
        // populate state selection feature
        for (var i = 1; i < data.length; i++) {
            $('#stateSelect').append($('<option></option>')
                .attr('value', data[i].id)
                .text(data[i].id));
        }

        // populate vaccine selection feature
        var labels = Object.keys(data[0]);
        for (var i = 1; i < labels.length; i++) {
            $('#vaccineSelect').append($('<option></option>')
                .attr('value', labels[i])
                .text(labels[i]));
        }


        // graphic margins - the D3 setup references the setup from module 8, exercise 3
        var margin = {top: 50, right: 250, bottom: 100, left: 50};

        // graphic dimensions
        var width = 1250 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        // selected data to be displayed
        var selectedVaccines = ['3+DTaP', '4+DTaP', '3+Polio'];
        var selectedStates = ['Alabama', 'Alaska', 'Arizona'];
        var selectedData = [];

        // default selected values for the selection features
        $('#stateSelect').val(selectedStates);
        $('#vaccineSelect').val(selectedVaccines);

        // d3 variables for setup
        var yScale;
        var xStateScale;
        var xVaccineScale;
        var color = d3.scale.category20();

        // filters the csv data into an array of state and specific vaccine pairs
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

        // Add elements to DOM to prepare graphic
        var svg = d3.select('#vis').append('svg').attr('width', 1250).attr('height', 500);

        // Axis elements
        var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ")")
            .attr('width', width)
            .attr('height', height);

        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var xAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')');

        var xAxisTitle = svg.append('text')
            .attr('transform', 'translate(' + ((width / 2) + margin.left - 20) + ',' + (height + margin.top + (margin.bottom / 2)) + ')')
            .text('State');

        var yAxisTitle = svg.append('text')
            .attr('transform', 'translate(' + 10 + ', ' + ((height / 2) + margin.top + margin.bottom) + ') rotate(-90)')
            .text("Estimated Vaccine Coverage (%)");

        // Sets the scales from the given data
        function setScales(data) {
            var minY = d3.min(data, function(d) {return d.v_value});
            var maxY = d3.max(data, function(d) {return d.v_value});

            // yScale for percent coverage; xStateScale for states selected; xVaccineScale for vaccines selected
            // Allows for grouped bar charts. References https://bl.ocks.org/mbostock/3887051
            yScale = d3.scale.linear().range([height, 0]).domain([0, maxY]);
            xStateScale = d3.scale.ordinal().rangeBands([0, width],.2).domain(selectedStates);
            xVaccineScale = d3.scale.ordinal().rangeRoundBands([0, xStateScale.rangeBand()], 0).domain(selectedVaccines);
        }

        // Sets the axes based on the scales
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

        // Draws the graphic based on the given data
        function draw(data) {
            // Sets up scales and axes
            setScales(data);
            setAxes();

            // Selects the bars and assigns unique id to data
            var states = g.selectAll('rect').data(data, function(d) {return d.state + d.v_name + Math.random()});

            // Data-join and add bars
            states.enter()
                .append('rect')
                .attr('data-toggle', 'tooltip')
                .attr('width', xVaccineScale.rangeBand())
                .attr('height', 0)
                .attr('x', function(d) {return xStateScale(d.state) + xVaccineScale(d.v_name)})
                .attr('y', height)
                .attr('fill', function(d) {return color(d.v_name)})
                .attr('title', function(d) {return d.v_name + ': ' + d.v_value + "%"});

            // Remove bars that is no longer in the data
            states.exit().remove();

            // Adds a transition effect for bars to display actual percent coverage
            states.transition()
                .duration(500)
                .attr('width', xVaccineScale.rangeBand())
                .attr('height', function(d) {return height - yScale(d.v_value)})
                .attr('x', function(d) {return xStateScale(d.state) + xVaccineScale(d.v_name)})
                .attr('y', function(d) {return yScale(d.v_value)})
                .attr('fill', function(d) {return color(d.v_name)})
                .attr('title', function(d) {return d.v_name + '-' + d.v_value + "%"});

            // Legend setup - references https://bl.ocks.org/mbostock/3887051
            var legend = svg.selectAll(".legend").data(selectedVaccines, function(d) {return d + Math.random()});

            legend.enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {return "translate(60," + (i) * 20 + ")";});

            legend.append("rect")
                .attr("x", width - 50)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 30)
                .attr("y", 15)
                .style("text-anchor", "start")
                .text(function(d) {return d});

            legend.exit().remove();

            // Enable tooltip
            $("rect").tooltip({
                'container': 'body',
                'placement': 'top'
            });
        }

        // Redraw graphic if different state(s) selected
        $('#stateSelect').change(function() {
            selectedStates = [];

            $('#stateSelect option:selected').each(function() {
                selectedStates.push($(this).text());
            });

            filterData();
            draw(selectedData);
        });

        // Redraw graphic if different vaccine(s) selected
        $('#vaccineSelect').change(function() {
            selectedVaccines = [];

            $('#vaccineSelect option:selected').each(function() {
                selectedVaccines.push($(this).text());
            });

            filterData();
            draw(selectedData);
        });

        // Create the graphic with preset data for the first time
        filterData();
        draw(selectedData);
    });
});