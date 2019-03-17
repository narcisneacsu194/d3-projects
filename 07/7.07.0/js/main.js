var width = 600,
        height = 400,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 60);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
           return d.population; 
        });

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("data/donut1.csv", type, function(error, data) {
        if (error) throw error;

        console.log(data)
        console.log(pie(data))

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
              return color(d.data.age); 
            });

        const legend = svg.append('g')
          .attr('transform', 'translate(' + (width / 2 - 10) + ', 0)');

        data.forEach((d, index) => {
          let legendRow = legend.append('g')
            .attr('transform', 'translate(0, ' + (index * 20 ) + ')');

          legendRow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', color(d.age));

          legendRow.append('text')
            .attr('x', -10)
            .attr('y', 10)
            .attr('text-anchor', 'end')
            .text(d.age)
        });
    });

    function type(d) {
        d.population = +d.population;
        return d;
    }