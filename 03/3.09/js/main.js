/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.9 - Margins and groups
*/

const margins = { top: 10, right: 10, bottom: 100, left: 100 };

const width = 600 - margins.right - margins.left;
const height = 400 - margins.top - margins.bottom;

const svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', width + margins.right + margins.left)
    .attr('height', height + margins.top + margins.bottom)
    .attr('style', 'border: 3px solid black');

const g = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

d3.json('data/buildings.json').then((data) => {
  data.forEach((building) => {
    building.height = +building.height;
  });

  const x = d3.scaleBand()
    .domain(data.map((building) => {
      return building.name;
    }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (building) => { return building.height })])
    .range([0, height]);

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (building) => {
      return x(building.name);
    })
    .attr('y', 20)
    .attr('width', x.bandwidth)
    .attr('height', (building) => {
      return y(building.height);
    })
    .attr('fill', 'grey');
  
}).catch(error => console.log(error));