var width = 600,
height = 400;

var projection = d3.geoEquirectangular()
.scale(100)
.translate([width / 2, height / 2])
.precision(.1);

var path = d3.geoPath()
.projection(projection);

var graticule = d3.geoGraticule();

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.attr('style', 'border: 3px solid black');

d3.json("data/world-110m.json", function(error, world) {
if (error) throw error;

console.log(world)
console.log(topojson.feature(world, world.objects.land));
console.log(graticule)

svg.append("path")
    .datum(topojson.feature(world, world.objects.land))
    .attr("class", "land")
    .attr("d", path);

svg.append("path")
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) { 
      return a !== b; 
    }))
    .attr("class", "boundary")
    .attr("d", path);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
});

// d3.select(self.frameElement).style("height", height + "px");