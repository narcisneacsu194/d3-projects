/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7 - Loading external data
*/

d3.json('data/ages.json').then((data) => {

  data.forEach((person) => {
    person.age = +person.age;
  });

  const svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .attr('style', 'border: 3px solid black');

  const circles = svg.selectAll('circle').data(data);

  circles.enter()
    .append('circle')
    .attr('cx', (person, index) => {
      return (index * 50) + 25;
    })
    .attr('cy', 25)
    .attr('r', (person) => {
      return person.age * 2;
    })
    .attr('fill', (person) => {
      if(person.name === 'Tony'){
        return 'blue';
      }else{
        return 'red';
      }
    })
}).catch(error => console.log(error));