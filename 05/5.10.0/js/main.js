/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const margins = { left:80, right:20, top:50, bottom:100 };
const width = 800 - margins.left - margins.right;
const height = 500 - margins.top - margins.bottom;

const svg = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margins.left + margins.right)
  .attr('height', height + margins.top + margins.bottom);

const g = svg.append('g')
  .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

const x = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const area = d3.scaleLinear()
  .domain([2000, 1400000000])
  .range([25*Math.PI, 1500*Math.PI]);

const continentColor = d3.scaleOrdinal(d3.schemePastel1);

const xAxis = d3.axisBottom(x).tickValues([400, 4000, 40000])
  .tickFormat((data) => {
	return '$' + data;
  });
const yAxis = d3.axisLeft(y);

g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + height + ')')
  .call(xAxis);

g.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

// X Label
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .text('GDP Per Capita ($)');

// Y Label
g.append('text')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .attr('transform', 'rotate(-90)')
  .text('Life Expectancy (Years)');

const yearDisplay = g.append('text')
  .attr('x', 640)
  .attr('y', 320)
  .attr('text-anchor', 'middle')
  .attr('font-size', '40px')
  .attr('style', 'opacity: 0.4')
  .text('1800');

d3.json("data/data.json").then(function(data){
	console.log(data);
	const newData = data.map((year) => {
	  let countries = year.countries;
	  countries = countries.filter((country) => {
		if(country.income && country.life_exp){
		  return country;
		}
	  });

	  year.countries = countries;
	  return year;
	});

	let index = 0;
	let yearCountries = newData[index++].countries;
	
	d3.interval(() => {
	  if(index === newData.length)index = 0;
	  yearCountries = newData[index].countries;
	  update(yearCountries, newData[index++].year);
	}, 100);

	update(yearCountries, '1800');
});

const update = (data, time) => {
  const t = d3.transition().duration(100);
  const circles = g.selectAll('circle')
	.data(data, (data) => {
	  return data.country;
	});
	
  circles.exit().remove();

  circles.enter()
  .append('circle')
	.attr('fill', (country) => {
    return continentColor(country.continent)
  })
	.merge(circles)
	.transition(t)
	.attr('cx', (country) => {
	  return x(country.income);
	})
	.attr('cy', (country) => {
	  return y(country.life_exp);
  })
  .attr('r', (country) => {
    return Math.sqrt(area(country.population) / Math.PI);
  });

  yearDisplay.text(time);
};