/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.3 - Adding an update function
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

const xAxisGroup = g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + height + ')');

const yAxisGroup = g.append('g')
  .attr('class', 'y axis');

const x = d3.scaleBand()
  .range([0, width])
  .paddingInner(0.3)
  .paddingOuter(0.3);

const y = d3.scaleLinear()
  .range([height, 0]);

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

d3.json("data/revenues.json").then(function(data){
    // console.log(data);

    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue;
    });

    d3.interval(function(){
      update(data)
    }, 1000);

    update(data);
});

const update = (data) => {
  console.log('The calling of the update function.');
  x.domain(data.map((item) => {
    return item.month;
  }));

  y.domain([0, d3.max(data, (item) => {
    return item.revenue;
  })]);

  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  yAxisGroup.call(yAxisCall);
};

