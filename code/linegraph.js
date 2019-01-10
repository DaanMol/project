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
d3.select("body").append("h2").text("Clickable timeperiods update graph below")

var margin = {top: 20, right: 10, bottom: 20, left: 25};

var width = 1500,
    height = 300;
    width2 = 900;
    height2 = 400;
    height3 = 600;
    width3 = 960;

// create variable for quick svg acces
var svg = d3.selectAll("body")
            .style("background-color", "#d0dce5") //#F8E5D7 // #bac5d1
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var svg2 = d3.selectAll("body")
            .append("svg")
            .attr("width", width2)
            .attr("height", height2);

var svg3 = d3.selectAll("body")
             .append("svg")
             .attr("width", width3)
             .attr("height", height3)

var myTool = d3.select("body")
               .append("div")
               .attr("class", "mytooltip")
               .style("opacity", "0")
               .style("display", "none");

var pathing = d3.geoPath();

window.onload = function() {

  d3.json("presidents.json").then(function(data) {
    window.data = data
    formatDate(data)
    drawOpening(data)
    drawPres(data)
  })

  d3.json("congress.json").then(function(data2) {
    console.log(data2)
  })

  d3.json("votes.json").then(function(data3) {
    console.log(data3)
    window.data3 = data3
    drawMap(data3)
  })
}

function formatDate(data) {
  /* Formats the date to d3 date */
  // format the dates
  var parseTime = d3.timeParse("%m/%d/%Y");

  for (name in data) {
    selection = data[name]
    for (date in selection) {
        selection[date]["Start"] = parseTime(selection[date]["Start"]);
    }
  };

}

function drawOpening(data) {
  var names = Object.keys(data)

  // create x scale for the names
  var xScale = d3.scaleLinear()
                 .domain([0, names.length])
                 .range([margin.left, width - margin.right]);

  // create yscale for approval rating
  var yScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([height - margin.bottom, 0 + margin.top]);

  // create line function
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

  // draw x-axis labels
  svg.selectAll("label")
     .data(names)
     .enter()
     .append("text")
     .text(function(d) {
       return d
     })
     .attr("x", function(d, i) {
       return xScale(i) + 5
     })
     .attr("y", height - 5)

  // call x scale
  svg.append("g")
     .attr("transform", "translate(0," + (height - margin.bottom) + ")")
     .call(d3.axisBottom(xScale));

  // draw the line
  svg.append("path")
    .datum(names)
    .attr("class", "line")
    .attr("d", line);

  // add selection borders
  var rects = svg.selectAll("rect")
                 .data(names)
                 .enter()
                 .append("rect");

  // draw selection panels over the line
  rects.attr("x", function(d, i) { return xScale(i) })
       .attr("y", margin.top)
       .attr("width", (xScale(2) - xScale(1)))
       .attr("height", height - 40)
       .attr("class", "panel")
       // display tooltip
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
       // keep the tooltip above the mouse when mouse is on selection
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
       // update the individual chart when clicked
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

function drawPres(data) {
    /* Draw initial presentation of individual line chart */

    // get selection from data and get the pre-formatted dates
    var selection = data["Roosevelt"]
        original = Object.keys(selection)

    // create the y scale for rating and x scale for dates
    var x = d3.scaleTime().range([margin.left, width2 - margin.right]);
        y = d3.scaleLinear().range([height2 - margin.bottom, margin.top]);
        valueline = d3.line()
                      .x(function(d) { return x(selection[d]["Start"]); })
                      .y(function(d) { return y(selection[d]["Approving"]); });

    // assing the proper domain to the scales
    // x scale is based on time
    x.domain(d3.extent(original, function(d) { return selection[d]["Start"]; }));
    y.domain([0, 100]);

    // draw the line
    svg2.append("path")
        .data([original])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + (height2 - margin.bottom) + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg2.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // add dots on line
    svg2.selectAll(".dot")
       .data(original)
     .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return x(selection[d]["Start"]) })
       .attr("cy", function(d) { return y(selection[d]["Approving"]) })
       .attr("r", 5)

   // add title
   svg2.append("text")
       .attr("transform", "translate(60,50)")
       .attr("class", "indTitle")
       .style("font-size", "25px")
       .text("Roosevelt")
}

function updatePres(userInput) {
    /* Update the individual graph to the selected president */

    var selection = data[userInput]
        original = Object.keys(selection)

    // assign scales and line functions
    var x = d3.scaleTime().range([margin.left, width2 - margin.right]);
        y = d3.scaleLinear().range([height2 - margin.bottom, margin.top]);
        valueline = d3.line()
                      .x(function(d) { return x(selection[d]["Start"]); })
                      .y(function(d) { return y(selection[d]["Approving"]); });

    // assing the proper domain to the scales
    x.domain(d3.extent(original, function(d) { return selection[d]["Start"]; }));
    y.domain([0, 100]);

    // update the title
    svg2.selectAll(".indTitle")
        .text(userInput)
        .style("font-size", "25px")

    svg2.selectAll(".line")
        .data([original])
        .transition()
        .duration(500)
        .attr("d", valueline)

    svg2.selectAll(".dot")
       .remove().exit()
       .data(original)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return x(selection[d]["Start"]) })
       .attr("cy", function(d) { return y(selection[d]["Approving"]) })
       .attr("r", 5)

    svg2.selectAll(".xaxis")
       .transition()
       .duration(500)
       .call(d3.axisBottom(x));

    svg2.selectAll(".yaxis")
       .transition()
       .duration(500)
       .call(d3.axisLeft(y));
}

function drawMap(data3) {

  d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {

    svg3.append("g")
        .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", pathing);

    svg3.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
  });
}
