/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const margins = { top: 10, right: 10, bottom: 150, left: 100 };

const width = 600 - margins.right - margins.left;
const height = 400 - margins.top - margins.bottom;

const svg = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margins.right + margins.left)
  .attr('height', height + margins.top + margins.bottom);

const g = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

// X Label
g.append('text')
  .attr('class', 'x axis-label')
  .attr('x', width / 2)
  .attr('y', height + 50)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

g.append('text')
  .attr('class', 'y axis-label')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Revenue');

d3.json('data/revenues.json').then((data) => {
  data.forEach((item) => {
    item.revenue = +item.revenue;
  });

  const x = d3.scaleBand()
    .domain(data.map((item) => {
      return item.month;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (item) => item.revenue)])
    .range([height, 0]);

  const xAxisCall = d3.axisBottom(x);

    g.append('g')
      .attr('class', 'x axis-bottom')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxisCall)
      .selectAll('text')
        .attr('text-anchor', 'middle');

  const yAxisCall = d3.axisLeft(y)
    .tickFormat((revenue) => {
      return '$' + revenue;
    });

    g.append('g')
      .attr('class', 'y axis-left')
      .call(yAxisCall);

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (data) => {
      return x(data.month);
    })
    .attr('y', (data) => {
      return y(data.revenue)
    })
    .attr('width', x.bandwidth)
    .attr('height', (data) => {
      return height - y(data.revenue)
    })
    .attr('fill', 'grey');

}).catch(error => console.log(error));