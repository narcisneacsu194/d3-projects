const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const svg = d3.select('svg');
const width = svg.attr('width') - margin.left - margin.right;
const height = svg.attr('height') - margin.top - margin.bottom;
const g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const parseTime = d3.timeParse('%d-%b-%y');

const x = d3.scaleTime()
  .rangeRound([0, width]);
const y = d3.scaleLinear()
  .rangeRound([height, 0]);

const area = d3.area()
  .x((d) => { return x(d.date); })
  .y0(y(0))
  .y1((d) => { return y(d.close); });

d3.tsv('data/area.tsv', (d) => {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, (error, data) => {
  if(error) throw error;

  x.domain(d3.extent(data, (d) => {
    return d.date;
  }));
  y.domain([0, d3.max(data, (d) => {
    return d.close;
  })]);

  g.append('path')
    .datum(data)
    .attr('fill', 'steelblue')
    .attr('d', area);

  g.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Price ($)')
});



