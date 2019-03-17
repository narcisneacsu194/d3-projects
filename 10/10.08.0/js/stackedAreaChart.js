StackedAreaChart = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
};

StackedAreaChart.prototype.initVis = function(){
  var vis = this;

  vis.margin = { left:80, right:100, top:50, bottom:40 };
  vis.width = 800 - vis.margin.left - vis.margin.right;
  vis.height = 370 - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select(vis.parentElement).append('svg')
    .attr('width', vis.width + vis.margin.left + vis.margin.right)
    .attr('height', vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append('g')
    .attr('transform', 'translate(' + vis.margin.left + ', ' + vis.margin.top + ')');

  vis.x = d3.scaleTime().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);
  vis.z = d3.scaleOrdinal(d3.schemePastel1);

  vis.xAxisCall = d3.axisBottom()
    .ticks(4);
  vis.yAxisCall = d3.axisLeft();

  vis.xAxis = vis.g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + vis.height + ')');

  vis.yAxis = vis.g.append('g')
    .attr('class', 'y-axis');

  vis.stack = d3.stack();
  vis.area = d3.area()
    .x(function(d, i) {
       return vis.x(d.data.date); 
    })
    .y0(function(d) { 
      return vis.y(d[0]); 
    })
    .y1(function(d) { 
      return vis.y(d[1]); 
    });

  var regions = ['northeast', 'west', 'south', 'midwest'];

  var legend = vis.g.append('g')    
    .attr('transform', 'translate(80, -25)');
  
  regions.forEach((region, index) => {
    var legendCol;
  
  legendCol = legend.append('g')
    .attr('class', 'legendCol')
    .attr('transform', 'translate(' + (index * 140) + ', 0)');
      
  legendCol.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', vis.z(region));
  
  legendCol.append('text')
    .attr('x', 15)
    .attr('y', 10)
    .attr('text-anchor', 'start')
    .style('text-transform', 'capitalize')
    .text(region);
  });

  this.wrangleData();
};

StackedAreaChart.prototype.wrangleData = function(){
  var vis = this;
  var varSelectValue = $('#var-select').val();

  var startingDate = parseDate($('#dateLabel1').text());
  var endDate = parseDate($('#dateLabel2').text());

  vis.newFilteredData = filteredData.filter((d) => {
    return d.date > startingDate && d.date < endDate;
  });

  vis.newFilteredData = vis.newFilteredData.reverse();

  vis.newObjArr = [];
  let sumWest;
  let sumSouth;
  let sumNortheast;
  let sumMidwest;
  let newObj;

  for(let i = 0;i < vis.newFilteredData.length;i++){
    let tempDate = vis.newFilteredData[i].date;
    sumWest = 0;sumSouth = 0;
    sumNortheast = 0;sumMidwest = 0;

    let j = i + 1;
    while(j < vis.newFilteredData.length && vis.newFilteredData[j].date.getTime() === tempDate.getTime()){
      var dayData = vis.newFilteredData[j];
      switch(vis.newFilteredData[j].team){
        case 'west':
          sumWest += dayData[varSelectValue];
          break;
        case 'south':
          sumSouth += dayData[varSelectValue];
          break;
        case 'northeast':
          sumNortheast += dayData[varSelectValue];
          break;
        case 'midwest':
          sumMidwest += dayData[varSelectValue];
          break;
      }

      j++;
    }

    i = j-1;

    newObj = {
      west: sumWest,
      south: sumSouth,
      northeast: sumNortheast,
      midwest: sumMidwest,
      date: tempDate
    };

    vis.newObjArr.push(newObj);
  }

  this.updateVis();
};

StackedAreaChart.prototype.updateVis = function(){
  var vis = this;

  vis.t = d3.transition().duration(1000);

  var maxDateVal = d3.max(vis.newObjArr, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== 'date' ? d[key] : 0 });
    return d3.sum(vals);
  });

  vis.x.domain(d3.extent(vis.newObjArr, (d) => {
    return d.date;
  }));
  
  vis.y.domain([0, maxDateVal]);

  vis.stack.keys(['west', 'south', 'northeast', 'midwest']);

  var modifiedData = vis.stack(vis.newObjArr);

  var newG = vis.g.selectAll('.team')
    .data(modifiedData);

  newG.select('.area')
    .attr('d', vis.area);

  newG.enter()
  .append('g')
  .attr('class', function(d){
    return 'team ' + d.key;
  }).append('path')
    .attr('class', 'area')
    .attr('d', vis.area)
    .style('fill', (d) => {
      return vis.z(d.key)
    })
    .style('fill-opacity', 0.5);

  vis.xAxisCall.scale(vis.x);
  vis.yAxisCall.scale(vis.y);

  vis.xAxis.transition(vis.t).call(vis.xAxisCall);
  vis.yAxis.transition(vis.t).call(vis.yAxisCall);
};



