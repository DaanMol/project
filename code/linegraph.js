/* Programmeerproject
 * Daan Molleman
 * 11275820
 * Presidential Cheatsheet linegraph
 */

 var presidents = ["Roosevelt", "Truman", "Eisenhower", "Kennedy", "Johnson",
                   "Nixon", "Ford", "Carter", "Reagan", "BushSr", "Clinton",
                   "BushJr", "Obama", "Trump"]

d3.select("head").append("title").text("The Presidential cheatsheet")
d3.select("body").append("h1").text("The Presidential cheatsheet")
                              .attr("class", "head")
d3.select("body").append("h2").text("Daan Molleman - 11275820")

var margin = {top: 20, right: 10, bottom: 20, left: 25};

var width = 1500,
    height = 300;

// create variable for quick svg acces
var svg = d3.selectAll("body")
            .style("background-color", "#d0dce5") //#F8E5D7 // #bac5d1
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var myTool = d3.select("body")
               .append("div")
               .attr("class", "mytooltip")
               .style("opacity", "0")
               .style("display", "none");

window.onload = function() {

  d3.json("presidents.json").then(function(data) {
    console.log(data)
    drawOpening(data)
  })

  d3.json("congress.json").then(function(data) {
    console.log(data)
  })
}

function drawOpening(data) {
  var names = Object.keys(data)
  var xScale = d3.scaleLinear()
                 .domain([0, names.length])
                 .range([margin.left, width - margin.right]);

  var yScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([height - margin.bottom, 0 + margin.top]);

  var line = d3.line()
               .x(function(d, i) { return xScale(i) + ((xScale(2) - xScale(1))/2); })
               .y(function(d) { return yScale(points[d]); })
               .curve(d3.curveMonotoneX)

  // retrieve list of average rating for each president
  points = average(data)

  // call y-axis ticks
  svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(d3.axisLeft(yScale));

  svg.selectAll("label")
     .data(names)
     .enter()
     .append("text")
     .text(function(d) {
       return d
     })
     .attr("x", function(d, i) {
       return xScale(i)
     })
     .attr("y", height - 5)

  svg.append("path")
    .datum(names)
    .attr("class", "line")
    .attr("d", line);

  var rects = svg.selectAll("rect")
                 .data(names)
                 .enter()
                 .append("rect");

  rects.attr("x", function(d, i) { return xScale(i) })
       .attr("y", margin.top)
       .attr("width", (xScale(2) - xScale(1)))
       .attr("height", height - 40)
       .attr("class", "panel")
       .on("mouseover", function(d) {
          d3.select(this)
               .style("cursor", "pointer")
               .attr("class", "sel")
               myTool
                 .transition()
                 .duration(300)
                 .style("opacity", "1")
                 .style("display", "block")
       })
       // keep the tooltip above the mouse when mouse is on bar
       .on("mousemove", function(d) {
          d3.select(this)
          myTool
            .html("<div id='thumbnail'><span> Average rating: "
                   + Math.round(points[d]) + "</div>")
            .style("left", (d3.event.pageX - 60) + "px")
            .style("top", (d3.event.pageY - 100) + "px")
       })

       // remove tooltip and restore colour
       .on("mouseout", function(d, i) {
          d3.select(this)
            .style("cursor", "normal")
            .attr("class", "panel")
            myTool
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("display", "none")
       })
       .on("click", function(d) {
          userInput = d
          updatePres(userInput)
       })
}

function average(data) {
  /* Calculates average approval rating */

  var averages = {}
  for (name in data) {
    var total = 0
    var amount = Object.keys(data[name]).length
    for (date in data[name]) {
      total += data[name][date]["Approving"]
    }
    var avg = total / amount
    averages[name] = avg
  }
  return averages
}

function updatePres(userInput) {

}
