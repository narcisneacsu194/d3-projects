/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json('data/buildings.json').then((data) => {
  console.log(data);

  data.forEach((building) => {
    building.height = +building.height;
  });

  const svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .attr('style', 'border: 3px solid black');

  const rects = svg.selectAll('rect').data(data);

  rects.enter()
    .append('rect')
    .attr('x', (building, index) => {
      return (index * 40) + 25;
    })
    .attr('y', 25)
    .attr('width', 25)
    .attr('height', (building) => {
      return building.height;
    })
    .attr('fill', 'gray');
}).catch(error => console.log(error));