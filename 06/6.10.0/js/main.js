const margin = { left: 80, right: 100, top: 50, bottom: 100 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('style', 'border: 3px solid black');

const g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
let bisectDate = d3.bisector(function(d) { return d.date; }).left;

const x = d3.scaleTime()
  .range([0, width]);
const y = d3.scaleLinear()
  .range([height, 0]);

const xAxis = g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')');

const yAxis = g.append('g')
  .attr('class', 'y axis');

const parseTime = d3.timeParse('%d/%m/%Y');
const formatTime = d3.timeFormat('%d/%m/%Y');

g.append('path')
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', 'grey')
  .attr('stroke-width', '3px');

// X Label
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 50)
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .text('Time');

// Y Label
const yLabel = g.append('text')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .attr('transform', 'rotate(-90)')
  .text('Price (USD)');

let line = d3.line()
  .x((d) => { return x(d.date); })
  .y((d) => { return y(d.price_usd) });

$('#coin-select').on('change', function(){
  displayVisualization();
});

$('#var-select').on('change', function(){
  displayVisualization();
});

$("#date-slider").slider({
  range: true,
  min: parseTime('12/5/2013').getTime(),
  max: parseTime('31/10/2017').getTime(),
  step: 86400000,
  values: [ parseTime('12/5/2013').getTime(), parseTime('31/10/2017').getTime()],
  slide: function( event, ui ) {
    $('#dateLabel1').text(formatTime(new Date(ui.values[0])));
    $('#dateLabel2').text(formatTime(new Date(ui.values[1])));
    displayVisualization();
  }
});

const displayVisualization = () => {
    d3.json('data/coins.json').then((coins) => {
        const currencyName = $('#coin-select').val();
        const varName = $('#var-select').val();
        const startingDate = parseTime($('#dateLabel1').html());
        const endDate = parseTime($('#dateLabel2').html());
        let currencyArr = coins[currencyName];
    
        currencyArr = currencyArr.filter((day) => {
          const parsedDayDate = parseTime(day.date);
          return day['24h_vol'] && day.market_cap && 
            day.price_usd && parsedDayDate >= startingDate &&
              parsedDayDate <= endDate;
        });
        
        currencyArr.forEach((day) => {
          
          day.date = parseTime(day.date);
          day['24h_vol'] = +day['24h_vol'];
          day.market_cap = +day.market_cap;
          day.price_usd = +day.price_usd;
        });
    
        x.domain(d3.extent(currencyArr, (d) => {
            return d.date;
        }));

        let yMin = d3.min(currencyArr, (d) => {
          return d[varName];
        });
        let yMax = d3.max(currencyArr, (d) => {
          return d[varName];
        });

        y.domain([yMin, yMax]);

        const t = d3.transition().duration(1000);
        const axisTransition = d3.transition().duration(1500);
    
        let xAxisCall = d3.axisBottom(x)
        .ticks(4);

        xAxis.transition(axisTransition).call(xAxisCall);

        let yAxisCall = d3.axisLeft(y)
          .tickFormat((d) => {
            const currencyFormat = d3.format('.2s');
            const currency = currencyFormat(d);
            
            switch(currency[currency.length - 1]){
              case 'G': return currency.slice(0, -1) + 'B';
              case 'k': return currency.slice(0, -1) + 'K';
            }

            return currency;
        });

        yAxis.transition(axisTransition).call(yAxisCall);
    
        line = d3.line()
          .x((d) => { return x(d.date); })
          .y((d) => { return y(d[varName]) });

        g.select('.line')
          .transition(t)
          .attr('d', line(currencyArr));
        
        let labelStr = 'Price (USD)';

        if(varName === 'market_cap'){
          labelStr = 'Market Capitalization (USD)';
        }else if(varName === '24h_vol'){
          labelStr = '24 Hour Trading Volume (USD)';
        }

        yLabel.text(labelStr);

        var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg.append("rect")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var mouseArr = d3.mouse(this);
        var x0 = x.invert(mouseArr[0]);
        var i = bisectDate(currencyArr, x0, 1);
        var d0 = currencyArr[i - 1];
        var d1 = currencyArr[i];
        var d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d[varName]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[varName].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", height - y(d[varName]));
        focus.select(".y-hover-line").attr("x2", -x(d.date));
    }
    
    }).catch(error => console.log(error));
};

displayVisualization();