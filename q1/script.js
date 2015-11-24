var json;
d3.json("data1.json", function(error, data) {
if (error) return console.warn(error);
console.log("Some Data"+data);
visualize(data);
});
function visualize(data) {
  var buildOut = function(dataSeriesCount) {
      var currentXOffsets = [];
      var current_xIndex = 0;
      return function(d, y0, y){
          if(current_xIndex++ % dataSeriesCount === 0){
              currentXOffsets = [0, 0];
          }
          if(y >= 0) {
              d.y0 = currentXOffsets[1];
              d.y = y;
              currentXOffsets[1] += y;
          } else {
              d.y0 = currentXOffsets[0] + y;
              d.y = -y;
              currentXOffsets[0] += y;
          }
      }
  }
    var n = 3, // number of layers
    m = data.length, // number of samples per layer
    stack = d3.layout.stack() ,
    layers = stack(d3.range(n).map(function(d) {
      var a = [];
        			for (var i = 0; i < m; ++i) {
          			a[i] = {x: data[i]["country"], y: data[i]['growth' + (d+1)]};
        			}
    				return a;  })),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
    console.log(layers);
    var margin = {top: 40, right: 10, bottom: 20, left: 10},
        width = 1340 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, 1*width], .08);
    x.domain(data.map(function(d) {
      return d.country;
    }));
var y = d3.scale.linear()
    .domain([0, 2*yStackMax])
    .range([height, 0]);
var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#aad", "#556"]);
var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom");
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(i); });
var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) {
      a= x(d.x);
      if(a>0)
        return a;
      return -a; })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);
rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
d3.selectAll("input").on("change", change);
var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);
function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}
function transitionGrouped() {
  y.domain([0, yGroupMax]);
     rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}
function transitionStacked() {
  y.domain([0, yStackMax]);
  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}
}