/*
*    main.js
*    Mastering Data Visualization with D3.js
*    10.2 - File Separation 
*/

var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var filteredData;
var lineObj1;
var lineObj2;
var lineObj3;
var lineObj4;
var lineObj5;

// Event listeners
$("#coin-select").on("change", updateCharts);
$("#var-select").on("change", updateCharts);

// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui){
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
        updateCharts();
    }
});

d3.json("data/coins.json").then(function(data){

    // Prepare and clean data
    filteredData = {};
    for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
            continue;
        }
        filteredData[coin] = data[coin].filter(function(d){
            return !(d["price_usd"] == null)
        })
        filteredData[coin].forEach(function(d){
            d["price_usd"] = +d["price_usd"];
            d["24h_vol"] = +d["24h_vol"];
            d["market_cap"] = +d["market_cap"];
            d["date"] = parseTime(d["date"])
        });
    }

    lineObj1 = new LineChart('#chart-area1', 'bitcoin');
    lineObj2 = new LineChart('#chart-area2', 'ethereum');
    lineObj3 = new LineChart('#chart-area3', 'bitcoin_cash');
    lineObj4 = new LineChart('#chart-area4', 'litecoin');
    lineObj5 = new LineChart('#chart-area5', 'ripple');
});

function updateCharts(){
  lineObj1.wrangleData();
  lineObj2.wrangleData();
  lineObj3.wrangleData();
  lineObj4.wrangleData();
  lineObj5.wrangleData();
};