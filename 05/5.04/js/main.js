/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.4 - The D3 update pattern
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let flag = true;
const t = d3.transition().duration(750);
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0]);

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
const yLabel = g.append("text")
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
        d.profit = +d.profit;
    });

    d3.interval(function(){
        const newData = flag ? data : data.slice(1);
        update(newData);
        flag = !flag;
    }, 1000);

    // Run the vis for the first time
    update(data);
});

function update(data) {
    const value = flag ? 'revenue' : 'profit';
    x.domain(data.map(function(d){ return d.month }));
    y.domain([0, d3.max(data, function(d) { return d[value] })])

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);;

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return "$" + d; });
    yAxisGroup.transition(t).call(yAxisCall);

    const circles = g.selectAll('circle')
      .data(data, (item) => {
        return item.month;
      });

    circles.exit()
      .attr('fill', 'red')
      .transition(t)
        .attr('cy', y(0))
      .remove();

    circles.enter()
      .append('circle')
      .attr('cx', (item) => {
        return x(item.month) + x.bandwidth() / 2;
      })
      .attr('cy', y(0))
      .attr('r', 5)
      .attr('fill', 'grey')
      .merge(circles)
      .transition(t)
        .attr('cx', (item) => {
          return x(item.month) + x.bandwidth() / 2;
        })
        .attr('cy', (item) => {
          return y(item[value]);
        })

    const text = flag ? 'Revenue' : 'Profit';
    yLabel.text(text);
}

