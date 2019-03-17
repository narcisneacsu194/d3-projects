/*
*    donutChart.js
*    Source: Section 10, Lecture 5
*    Mastering Data Visualization with D3.js
*    FreedomCorp Dashboard
*/

DonutChart = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

DonutChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:40, right:100, top:40, bottom:10 };
    vis.width = 400 - vis.margin.left - vis.margin.right;
    vis.height = 190 - vis.margin.top - vis.margin.bottom;
    vis.radius = Math.min(vis.width, vis.height) / 2;

    vis.color = d3.scaleOrdinal(d3.schemeAccent);

    vis.pie = d3.pie()
        .padAngle(0.03)
        .value(function(d) { 
          return d.values[0].count;
        })
        .sort(null);

    vis.arc = d3.arc()
        .innerRadius(vis.radius - 35)
        .outerRadius(vis.radius - 20);

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + (vis.margin.left + (vis.width / 2 - 70)) + 
            ", " + (vis.margin.top + (vis.height / 2)) + ")");

    vis.g.append("text")
        .attr("y", -vis.height/2)
        .attr("x", -vis.width/2 + 30)
        .attr("font-size", "13px")
        .text('Company size');

    vis.companySizeArr = ['small', 'medium', 'large'];

    vis.legend = vis.g.append('g')
      .attr('transform', 'translate(150,-30)')
      .attr('class', 'legend');

    vis.companySizeArr.forEach(function(companySize, index){
      var legendRow = vis.legend.append('g')
        .attr('transform', 'translate(30,' + (index * 20) + ')')
        .attr('class', 'legendRow');

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', function(d){
          return vis.color(companySize);
        });

      legendRow.append('text')
        .attr('x', -60)
        .attr('y', 10)
        .attr('font-size', '15px')
        .attr('text-anchor', 'start')
        .style('text-transform', 'capitalize')
        .text(companySize)
    });

    vis.wrangleData();
}

DonutChart.prototype.wrangleData = function(){
    var vis = this;

    var numOfSmallComp = 0;
    var numOfMediumComp = 0;
    var numOfLargeComp = 0;

    for(let i = 0;i < filteredData2.length;i++){
        if(filteredData2[i].company_size === 'small')numOfSmallComp++;
        if(filteredData2[i].company_size === 'medium')numOfMediumComp++;
        if(filteredData2[i].company_size === 'large')numOfLargeComp++; 
    }

    var obj1 = { size: 'small', count: numOfSmallComp };
    var obj2 = { size: 'medium', count: numOfMediumComp };  
    var obj3 = { size: 'large', count: numOfLargeComp };

    var objArr = [obj1, obj2, obj3];

    vis.newArr = d3.nest()
      .key(function(d) {
        return d.size; 
      })
      .entries(objArr);

      var datex = $('#dateLabel1').text();
      console.log(`New Arr for date ${datex}: `, vis.newArr);
    
    vis.updateVis();
}

DonutChart.prototype.updateVis = function(){
    var vis = this;

    vis.path = vis.g.selectAll("path");

    // vis.data0 = vis.path.data();
    vis.data1 = vis.pie(vis.newArr);

    // JOIN elements with new data.
    vis.path = vis.path.data(vis.data1, key);
    
    // UPDATE elements still on the screen.
    vis.path.transition()
        .duration(750)
        .attrTween("d", arcTween)
        .select('title')
        .text(function(d){
          return d.data.values[0].count;
        })

    // ENTER new elements in the array.
    vis.pathh = vis.path.enter()
        .append("path")
        // .each(function(d, i) {
        //   this._current = findNeighborArc(i, vis.data0, vis.data1, key) || d; 
        // }) 
        .attr("fill", function(d) {
          return vis.color(d.data.values[0].size);
        })
        .attr("d", vis.arc)
        .append('title')
        .text(function(d){
          return d.data.values[0].count;
        });

    function key(d){
        return d.data.values[0].size;
    }

    // function findNeighborArc(i, data0, data1, key) {
    //     var d;
    //     return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
    //         : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
    //         : null;
    // }

    // // Find the element in data0 that joins the highest preceding element in data1.
    // function findPreceding(i, data0, data1, key) {
    //     var m = data0.length;
    //     while (--i >= 0) {
    //         var k = key(data1[i]);
    //         for (var j = 0; j < m; ++j) {
    //             if (key(data0[j]) === k) return data0[j];
    //         }
    //     }
    // }

    // // Find the element in data0 that joins the lowest following element in data1.
    // function findFollowing(i, data0, data1, key) {
    //     var n = data1.length, m = data0.length;
    //     while (++i < n) {
    //         var k = key(data1[i]);
    //         for (var j = 0; j < m; ++j) {
    //             if (key(data0[j]) === k) return data0[j];
    //         }
    //     }
    // }

    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(1)
        return function(t) { return vis.arc(i(t)); };
    }

}