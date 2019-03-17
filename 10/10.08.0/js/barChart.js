BarChart = function(_parentElement, _variable){
  this.parentElement = _parentElement;
  this.variable = _variable;

  this.initVis();
};

BarChart.prototype.initVis = function(){
  var vis = this;
  
  vis.margin = { left:60, right:50, top:30, bottom:30 };
  vis.width = 350 - vis.margin.left - vis.margin.right;
  vis.height = 130 - vis.margin.top - vis.margin.bottom;
  
  vis.svg = d3.select(vis.parentElement)
    .append('svg')
    .attr('width', vis.width + vis.margin.left + vis.margin.right)
    .attr('height', vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append('g')
    .attr('transform', 'translate(' + vis.margin.left + 
      ',' + vis.margin.top + ')');

  var chartLabel;

  if(vis.variable === 'units_sold')chartLabel = 'Units sold per call';
  else if(vis.variable === 'call_revenue')chartLabel = 'Average call revenue (USD)';
  else chartLabel = 'Average call duration (seconds)';

  vis.g.append("text")
    .attr("y", -10)
    .attr("x", -60)
    .attr("font-size", "13px")
    .text(chartLabel);

  vis.x = d3.scaleBand()
    .domain(['Electronics', 'Furniture', 'Appliances', 'Materials'])
    .rangeRound([0, vis.width]).padding(0.5);
  vis.y = d3.scaleLinear().rangeRound([vis.height, 0]);

  // X Axis
  vis.xAxis = vis.g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + vis.height + ')')
    .call(d3.axisBottom(vis.x));

  // Y Axis
  vis.yAxis = vis.g.append('g')
    .attr('class', 'y-axis');

  vis.xAxisCall = d3.axisBottom(vis.x);
  vis.yAxisCall = d3.axisLeft().ticks(4);

  vis.wrangleData();
};

BarChart.prototype.wrangleData = function(){
  var vis = this;

  vis.newFilteredData = d3.nest()
    .key(function(d){
      return d.category;
    })
    .entries(filteredData2);

  var averageNumbers = vis.newFilteredData.map((d) => {
    var valueArr = d.values;

    var m = d3.mean(valueArr, function(d2){
      switch(vis.variable){
        case 'units_sold':
          return d2.units_sold;
        case 'call_revenue':
          return d2.call_revenue;
        case 'call_duration':
          return d2.call_duration;
      }
    });

    return {
      key: d.key.charAt(0).toUpperCase() + d.key.slice(1),
      mean: m
    };

  });

  vis.averageArr = averageNumbers.map(function(d){
    var newObj = {};
    newObj.category = d.key;
    newObj.avg = d.mean;

    return newObj;
  });

  vis.updateVis();
};

BarChart.prototype.updateVis = function(){
  var vis = this;

  var t = d3.transition().duration(1000);

  // Domain update
  vis.y.domain([0, d3.max(vis.averageArr, function(d){
    return d.avg;
  })]);

  vis.yAxis.transition(t).call(vis.yAxisCall.scale(vis.y));

  vis.rects = vis.g.selectAll('.bar')
    .data(vis.averageArr, function(d){
      return d.category;
  });

  //Update bars
  vis.rects.transition(t)
    .attr('y', function(d){
      return vis.y(d.avg);
    })
    .attr('height', function(d){
      return vis.height - vis.y(d.avg);
    })
    .select('title')
    .text(function(d){
      return d.avg;
    });

  // ENTER bars
  vis.rects.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d){
      return vis.x(d.category);
    })
    .attr('y', function(d){
      return vis.y(d.avg);
    })
    .attr('width', vis.x.bandwidth)
    .attr('height', function(d){
      return vis.height - vis.y(d.avg);
    })
    .attr('fill', 'grey')
    .append('title')
    .text(function(d){
      return d.avg;
    });
};