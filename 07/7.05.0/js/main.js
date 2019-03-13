const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const svg = d3.select('svg');
const width = svg.attr('width') - margin.left - margin.right;
const height = svg.attr('height') - margin.top - margin.bottom;

const g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const parseDate = d3.timeParse('%Y %b %d');

const x = d3.scaleTime()
  .range([0, width]);
const y = d3.scaleLinear()
  .range([height, 0]);
const z = d3.scaleOrdinal(d3.schemeCategory20);

const stack = d3.stack();

const area = d3.area()
  .x((d) => {
    return x(d.data.date);
  })
  .y0((d) => { 
    return y(d[0]);
  })
  .y1((d) => { 
    return y(d[1]);
  });


const type = (d, i, columns) => {
  d.date = parseDate(d.date);
  for(let i = 1, n = columns.length;i < n; ++i){
    d[columns[i]] = d[columns[i]] / 100;
  }
  
  return d;
};

d3.tsv('data/stacked_area1.tsv', type, (error, data) => {
  if(error) throw error;

  const keys = data.columns.slice(1);
  
  x.domain(d3.extent(data, (d) => {
    return d.date;
  }));
  z.domain(keys);
  stack.keys(keys);

  const layer = g.selectAll('.layer')
    .data(stack(data))
    .enter().append('g')
    .attr('class', 'layer');

  layer.append('path')
    .attr('class', 'area')
    .style('fill', (d) => { return z(d.key); })
    .attr('d', area);

  layer.filter((d) => {
    return d[d.length - 1][1] - d[d.length - 1][0] > 0.01;
  })
    .append('text')
    .attr('x', width - 6)
    .attr('y', (d) => {
      return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
    })
    .attr('dy', '.35em')
    .style('font', '10px sans-serif')
    .style('text-anchor', 'end')
    .text((d) => {
      return d.key;
    });

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(x).ticks(3));

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(10, '%'));

});