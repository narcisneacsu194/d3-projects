var tsvData = null;

    var margin = {top: 20, right: 200, bottom: 30, left: 100},
        width = 800 - margin.left - margin.right, 
        height = 400 - margin.top - margin.bottom;

    var parseDate = d3.timeParse('%Y');
    var formatSi = d3.format(".3s");
    var formatNumber = d3.format(".1f"),
    formatBillion = function(x) {
      return formatNumber(x / 1e9); 
    };

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat(formatBillion);

    var area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });

    var stack = d3.stack()

    var svg = d3.select('body').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv('data/stacked_area2.csv', function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) {
          return key !== 'date'; 
        }));
        
        var keys = data.columns.filter(function(key) { return key !== 'date'; })
        
        data.forEach(function(d) {
            d.date = parseDate(d.date); 
        });
        
        tsvData = (function(){ return data; })();

        var maxDateVal = d3.max(data, function(d){
            var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
            return d3.sum(vals);
        });

        // Set domains for axes
        x.domain(d3.extent(data, function(d) { 
          return d.date; 
        }));
        y.domain([0, maxDateVal])

        stack.keys(keys);

        // stack.order(d3.stackOrderNone);
        // stack.offset(d3.stackOffsetNone);

        var browser = svg.selectAll('.browser')
            .data(stack(data))
            .enter().append('g')
            .attr('class', function(d){ return 'browser ' + d.key; })
            .attr('fill-opacity', 0.5);

        browser.append('path')
            .attr('class', 'area')
            .attr('d', area)
            .style('fill', function(d) { return color(d.key); });

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);


        svg.append('text')
          .attr('x', -(225))
          .attr('y', -60)
          .attr('transform', 'rotate(-90)')
          .attr('font-size', '20px')
          .text('Billions of liters')

        const legend = svg.append('g')
          .attr('transform', 'translate(' + (width + 150) + ', 20)');

        keys.forEach((key, index) => {
          let legendRow = legend.append('g')
            .attr('transform', 'translate(0, ' + (index * 20) + ')');

          legendRow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', color(key));


          legendRow.append('text')
            .attr('x', -10)
            .attr('y', 10)
            .attr('text-anchor', 'end')
            .style('text-transform', 'capitalize')
            .text(key);
        });
    });