var filteredData = {};
var filteredData2;
var stackedAreaChart;
var donutChart;
var barChart1;
var barChart2;
var barChart3;
var timeline;
var parseDate = d3.timeParse('%d/%m/%Y');
var formatDate = d3.timeFormat('%d/%m/%Y');

$('#var-select').on('change', function(){
  stackedAreaChart.wrangleData();
});

d3.json('data/calls.json').then((data) => {
  filteredData = data;

  filteredData.forEach((d, index) => {
    d.date = parseDate(d.date);

    return d;
  });

  filteredData2 = filteredData;

  stackedAreaChart = new StackedAreaChart('#stacked-area');
  donutChart = new DonutChart('#company-size');
  barChart1 = new BarChart('#units-sold', 'units_sold');
  barChart2 = new BarChart('#revenue', 'call_revenue');
  barChart3 = new BarChart('#call-duration', 'call_duration');
  timeline = new Timeline('#timeline');

}).catch(error => console.log(error));

function brushed(){
  var selection = d3.event.selection || timeline.x.range();
  var newValues = selection.map(timeline.x.invert);
  
  $('#dateLabel1').text(formatDate(newValues[0]));
  $('#dateLabel2').text(formatDate(newValues[1]));

  var startingDate = parseDate($('#dateLabel1').text());
  var endDate = parseDate($('#dateLabel2').text());

  filteredData2 = filteredData.filter((d) => {
    return d.date > startingDate && d.date < endDate;
  });

  stackedAreaChart.wrangleData();
  donutChart.wrangleData();
  barChart1.wrangleData();
  barChart2.wrangleData();
  barChart3.wrangleData();
};