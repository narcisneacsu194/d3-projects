/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

const svg = d3.select('#chart-area')
  .append('svg')
  .attr('width', 500)
  .attr('height', 400)
  .attr('style', 'border: 3px solid black');

const line = svg.append('line')
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 100)
  .attr('y2', 100)
  .attr('stroke', 'red')
  .attr('stroke-width', 2);

const rect = svg.append('rect')
  .attr('x', 125)
  .attr('y', 0)
  .attr('width', 100)
  .attr('height', 100)
  .attr('fill', 'purple');

const ellipse = svg.append('ellipse')
  .attr('cx', 350)
  .attr('cy', 50)
  .attr('rx', 100)
  .attr('ry', 50)
  .attr('fill', 'orange');