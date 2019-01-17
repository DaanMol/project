/* Programmeerproject
 * Daan Molleman
 * 11275820
 * Presidential Cheatsheet linegraph
 */

presidents = ["Roosevelt", "Truman", "Eisenhower", "Kennedy", "Johnson",
              "Nixon", "Ford", "Carter", "Reagan", "BushSr", "Clinton",
              "BushJr", "Obama", "Trump"]
election_years = ["Roosevelt1940", "Roosevelt1944", "Truman1948", "Eisenhower1952",
                  "Eisenhower1956", "Kennedy1960", "Johnson1964", "Nixon1968", "Nixon1972",
                  "Carter1976", "Reagan1980", "Reagan1984", "BushSr1988", "Clinton1992",
                  "Clinton1996", "BushJr2000", "BushJr2004", "Obama2008", "Obama2012", "Trump2016"]

d3.select("head").append("title").text("The Presidential cheatsheet")
var titleText = d3.select("body").append("div")
                                 .style("width", "100%")

titleText.append("h1").text("The Presidential cheatsheet")
                      .attr("class", "head")
titleText.append("h2").text("Daan Molleman - 11275820")
titleText.append("p").text("Clickable timeperiods update the graph and the map below. \
                                     Clicking a state will show the statistics for the \
                                     selected elections. These are selectable in the\
                                     dropdown menu.")
                     .attr("class", "paragraph")
titleText.append("h3").text("The POTUS's approval rating from 1940 through 2018")

d3.select("body").append("div")
                 .style("position", "relative")
                 .append("img")
                 .attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Seal_of_the_Executive_Office_of_the_President_of_the_United_States_2014.svg/1200px-Seal_of_the_Executive_Office_of_the_President_of_the_United_States_2014.svg.png")
                 .attr("width", "150")
                 .attr("height", "150")
                 .attr("class", "ribbon");

var margin = {top: 20, right: 10, bottom: 20, left: 50};

var width = 1500,
    height = 300;
    width2 = 900;
    height2 = 400;
    height3 = 600;
    width3 = 1500;

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

requests = [d3.json("presidents.json"), d3.json("congress.json"),
            d3.json("votes.json"), d3.json("codes.json")]

window.onload = function() {

  Promise.all(requests).then(function(response) {
    console.log(response)
    data = response[0]
    data2 = response[1]
    data3 = response[2]
    data4 = response[3]

    formatDate(data)
    createScales()
    drawCongress(formatYear(data2))
    drawOpening(data)
    drawPres(data)
  });
}

function createScales() {
  var selection = data["Roosevelt"],
      original = Object.keys(selection)

  // create the y scale for rating and x scale for dates
  x = d3.scaleTime().range([margin.left, width2 - margin.right]);
  y = d3.scaleLinear().range([height2 - margin.bottom, margin.top]);

  // assing the proper domain to the scales
  // x scale is based on time
  x.domain(d3.extent(original, function(d) { return selection[d]["Start"]; }));
  y.domain([0, 100]);
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
  }
};

function formatYear(data2) {
  /* format year to d3 date */
  var parseYear = d3.timeParse("%m/%d/%Y");

  congressData = []
  for (year in data2) {
    rawYear = "01/01/" + (year.split("-")[0])
    if (Number(year.split("-")[0]) >= 1940) {
      firstYear = parseYear(rawYear)
      data2[year].date = firstYear
      congressData.push(data2[year])
    }
  }
  return congressData
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

  // add Y axis label
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Approval rating in %");

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
         pres = d
         var years = getYears(d)
          updatePres(d)
          drawMap(years)
          drawDrop(years)
          if (typeof(state) != "undefined") {
            updateTip(state, sel)
          }
       })
}

function drawPres(data) {
    /* Draw initial presentation of individual line chart */
    pres = "Roosevelt"

    // get selection from data and get the pre-formatted dates
    var selection = data[pres]
        original = Object.keys(selection)

    // create the y scale for rating and x scale for dates
    x = d3.scaleTime().range([margin.left, width2 - margin.right]);
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

    // add Y axis label
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (height2 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Approval rating in % and percentage of Congress seats in %");

    // add dots on line
    svg2.selectAll(".dot")
       .data(original)
     .enter().append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return x(selection[d]["Start"]) })
       .attr("cy", function(d) { return y(selection[d]["Approving"]) })
       .attr("r", 5)
       .on("mouseover", function(d) {
          d3.select(this)
               .style("cursor", "pointer")
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
            .html("<div id='thumbnail'><span>" + selection[d]["Approving"] + "</div>")
            .style("left", (d3.event.pageX - 50) + "px")
            .style("top", (d3.event.pageY - 40) + "px")
       })

       // remove tooltip and restore colour
       .on("mouseout", function(d, i) {
          d3.select(this)
            .style("cursor", "normal")
            myTool
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("display", "none")
       })

    // add title
    svg2.append("text")
        .attr("transform", "translate(60,50)")
        .attr("class", "indTitle")
        .style("font-size", "25px")
        .text(function() { return "The individual approval rating of president " + pres})

    // add button to switch right
    svg2.append("text").attr("x", width2 - (margin.right * 5))
                       .attr("y", height2 - (margin.bottom * 2))
                       .attr("opacity", "1")
                       .text("Next");

    var rightButton = svg2.append("rect")
                          .attr("x", width2 - (margin.right * 6))
                          .attr("y", height2 - (margin.bottom * 3))
                          .attr("height", 30)
                          .attr("width", 50)
                          .attr("class", "button")
                          .on("click", function() {
                            updatePres(nextPres())
                            drawMap(getYears(pres))
                            drawDrop(getYears(pres))
                            updateTip(state, sel)
                          })

    // add button to go left
    svg2.append("text").attr("x", 2 * margin.left)
                       .attr("y", height2 - (margin.bottom * 2))
                       .text("Previous")

    var leftButton = svg2.append("rect")
                         .attr("x", 2 * margin.left)
                         .attr("y", height2 - (margin.bottom *3))
                         .attr("height", 30)
                         .attr("width", 50)
                         .attr("class", "button")
                         .on("click", function() {
                           updatePres(prevPres())
                           drawMap(getYears(pres))
                           drawDrop(getYears(pres))
                           updateTip(state, sel)
                         })
}

function drawCongress(congressData) {
  /* Draw congress seats in the individual graph */

  yCon = d3.scaleLinear()
        .domain([0, 435])
        .range([height2 - margin.bottom, margin.top])

  seats = svg2.append("g")

  var democrateSeats = seats.selectAll(".dembar")
                  .data(congressData)
                  .enter()
                  .append("rect");

  democrateSeats.data(congressData)
       .attr("x", function(d) {
         if (x(d.date) > margin.left) {
           return x(d.date);
         } else {
           return margin.left
         }
       })
       .attr("y", function(d) { return yCon(d.Democrats); })
       .attr("width", function(d) {
         var congressYears = d3.timeYear.offset(d.date, 2);
         if (x(d.date) > 0) {
           return (x(congressYears) - x(d.date))
         } else {
           return (x(congressYears) - margin.left)
         }
       })
       .attr("height", function(d) {
         return height2 - yCon(d.Democrats) - margin.top
       })
       .attr("class", "dembar")

    var republicanSeats = seats.selectAll(".repbar")
                    .data(congressData)
                    .enter()
                    .append("rect");

    republicanSeats.data(congressData)
         .attr("x", function(d) {
           if (x(d.date) > margin.left) {
             return x(d.date);
           } else {
             return margin.left
           }
         })
         .attr("y", margin.top)
         .attr("width", function(d) {
           var congressYears = d3.timeYear.offset(d.date, 2);
           if (x(d.date) > 0) {
             return (x(congressYears) - x(d.date))
           } else {
             return (x(congressYears) - margin.left)
           }
         })
         .attr("height", function(d) {
           return yCon(d.Democrats) - margin.top
         })
         .attr("class", "repbar")
}

function getYears(name) {
  /* Select the election years of the selected president */
  var years = []
  for (election in election_years) {
    if (election_years[election].includes(name)) {
      years.push(election_years[election])
    }
  }
  return years
}

function average(data) {
  /* Calculates average approval rating */

  var averages = {}
  for (name in data) {
    var total = 0
    for (date in data[name]) {
      total += data[name][date]["Approving"]
    }
    var avg = total / Object.keys(data[name]).length
    averages[name] = avg
  }
  return averages
}

function nextPres() {
  /* Returns the current presidents' successor */
  var currPres = presidents.indexOf(pres)
  return presidents[currPres + 1]
}

function prevPres() {
  /* Returns the current presidents' predecessor */
  var currPres = presidents.indexOf(pres)
  return presidents[currPres - 1]
}

function updatePres(userInput) {
    /* Update the individual graph to the selected president */
    pres = userInput

    var selection = data[userInput]
        original = Object.keys(selection)

    // assign scales and line functions
    x = d3.scaleTime().range([margin.left, width2 - margin.right]);
    y = d3.scaleLinear().range([height2 - margin.bottom, margin.top]);
    valueline = d3.line()
                      .x(function(d) { return x(selection[d]["Start"]); })
                      .y(function(d) { return y(selection[d]["Approving"]); });

    yCon = d3.scaleLinear()
          .domain([0, 435])
          .range([height2 - margin.bottom, margin.top])

    // assing the proper domain to the scales
    x.domain(d3.extent(original, function(d) { return selection[d]["Start"]; }));
    y.domain([0, 100]);

    // update the title
    svg2.selectAll(".indTitle")
        .text(function() { return "The individual approval rating of president " + userInput})
        .style("font-size", "25px")

    // draw the line
    svg2.selectAll(".line")
        .data([original])
        .transition()
        .duration(500)
        .attr("d", valueline)

    // draw the dots
    svg2.selectAll(".dot")
       .remove().exit()
       .data(original)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("cx", function(d, i) { return x(selection[d]["Start"]) })
       .attr("cy", function(d) { return y(selection[d]["Approving"]) })
       .attr("r", 5)
       .on("mouseover", function(d) {
          d3.select(this)
               .style("cursor", "pointer")
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
            .html("<div id='thumbnail'><span>" + selection[d]["Approving"] + "</div>")
            .style("left", (d3.event.pageX - 50) + "px")
            .style("top", (d3.event.pageY - 40) + "px")
       })

       // remove tooltip and restore colour
       .on("mouseout", function(d, i) {
          d3.select(this)
            .style("cursor", "normal")
            myTool
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("display", "none")
       })

    // call the x axis
    svg2.selectAll(".xaxis")
       .transition()
       .duration(500)
       .call(d3.axisBottom(x));

    // call the y axis
    svg2.selectAll(".yaxis")
       .transition()
       .duration(500)
       .call(d3.axisLeft(y));

    // update the stacked bars
    // update the democrates seats
    svg2.selectAll(".dembar")
        .transition()
        .duration(500)
        .attr("x", function(d) {
          if (x(d.date) > margin.left) {
            return x(d.date);
          } else {
            return margin.left
          }
        })
        .attr("y", function(d) {
          return yCon(d.Democrats);
        })
        .attr("width", function(d) {
          var congressYears = d3.timeYear.offset(d.date, 2);
          if (x(d.date) > 0) {
            return (x(congressYears) - x(d.date))
          } else {
            return (x(congressYears) - margin.left)
          }
        })
        .attr("height", function(d) {
          return height2 - yCon(d.Democrats) - margin.top
        })

        // update the republican seats
        svg2.selectAll(".repbar")
            .transition()
            .duration(500)
            .attr("x", function(d) {
              if (x(d.date) > margin.left) {
                return x(d.date);
              } else {
                return margin.left
              }
            })
            .attr("y", margin.top)
            .attr("width", function(d) {
              var congressYears = d3.timeYear.offset(d.date, 2);
              if (x(d.date) > 0) {
                return (x(congressYears) - x(d.date))
              } else {
                return (x(congressYears) - margin.left)
              }
            })
            .attr("height", function(d) {
              return yCon(d.Democrats) - margin.top
            })
}

function drawDrop(years) {
  /* Draws a dropdown menu */

  // remove old dropdown menu
  svg3.select("#dropDown")
      .remove()

  // send message if a president had no elections
  if (years.length == 0) {
    svg3.selectAll("#wikitip")
        .remove()
    wiki = svg3.append("text")
               .attr("x", 1000)
               .attr("y", 100)
               .attr("id", "dropDown")
               .text("No elections were held for this President")
               .style("font-size", "12px")
  } else {

    // import a foreign html object
    var dropDown = svg3.append("foreignObject")
                      .attr("width", 480)
                      .attr("height", 50)
                      .attr("id", "dropDown")
                      .attr("x", 1000)
                      .attr("y", 0)
                      .append("xhtml:body")

    // add the dropdown
    var selection = dropDown.append("select")
                            .data(years)
                            .attr("class", "form-control")
                            .on("change", function() {
                              year = d3.select('.form-control').property('value');
                              drawMap(year, true);
                              updateTip(state, sel);
                            });

    // add all the election years
    var options = selection.selectAll("option")
                           .data(years)
                           .enter()
                           .append("option")
                             .attr("value", function(d) { return d; })
                             .text(function(d) { return d; } );
  }
}

function drawMap(userSelection, selected=false) {
  /* Draw a map coloured with the winnin party's colour */

  // if no years are selected, present the first election
  if (selected == false) {
    sel = data3[userSelection[0]]
  } else {
    sel = data3[userSelection]
  }

  // remove old map
  svg3.selectAll("g")
      .remove()

  // import the topojson file
  d3.json("https://d3js.org/us-10m.v1.json").then(function(us) {

    svg3.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", pathing)
        .attr("class", function(d) { return getClass(d["id"], sel); })
        // display tooltip
        .on("mouseover", function(d) {
           d3.select(this)
                .style("cursor", "pointer")
                .attr("class", function(d) {
                  return getClass(d["id"], sel) + "sel"
                })
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
             .html("<div id='thumbnail'><span>" + data4[d["id"]] + "</div>")
             .style("left", (d3.event.pageX - 60) + "px")
             .style("top", (d3.event.pageY - 60) + "px")
        })

        // remove tooltip and restore colour
        .on("mouseout", function(d, i) {
           d3.select(this)
             .style("cursor", "normal")
             .attr("class", function(d) {
               return getClass(d["id"], sel)
             })
             myTool
               .transition()
               .duration(300)
               .style("opacity", "0")
               .style("display", "none")
        })
        // update the tip if a state is clicked
        .on("click", function(d) {
          state = data4[d["id"]]
          updateTip(data4[d["id"]], sel)
        })

    // draw the state borders
    svg3.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
  });
}

function getClass(id, sel) {
  /* Determine whether a state has more democrate or republican votes */

  // if a state has no votes, give it another colour
  if (typeof(sel[data4[id]]) == "undefined") {
    return "states"
  }
  var dem = sel[data4[id]]["Democrate EV"]
  var rep = sel[data4[id]]["Republican EV"]

  if (dem > rep) {
    return "dem"
  } else if (rep > dem) {
    return "rep"
  } else {
    return "other"
  }
}

function drawTip() {
  /* draw the initial tip text */
  svg3.selectAll("#wikitip")
      .remove()
  wiki = svg3.append("text")
             .attr("x", 1000)
             .attr("y", 100)
             .attr("id", "wikitip")
             .text("Click on a state for more information")
             .style("font-size", "12px")
}

function updateTip(state, sel) {
  /* Update the tip displayed when a state is clicked */

  // remove old tip
  svg3.selectAll("#wikitip")
      .remove()

  // dislpay error message when a state has no data
  if (typeof(sel[state]) == "undefined") {
    wiki = svg3.append("text")
               .attr("x", 1000)
               .attr("y", 120)
               .attr("id", "wikitip")
               .text("There is no data for this state")
               .style("font-size", "12px");
    return 1
  }

  // declare the column and the rows of the table
  var columns = ["Party", "Votes", "Percentage", "Electoral votes"],
      row1 = ["Democrates", sel[state]["Democrate Votes"], sel[state]["Democrate %"],
              sel[state]["Democrate EV"]],
      row2 = ["Republicans", sel[state]["Republican Votes"], sel[state]["Republican %"],
              sel[state]["Republican EV"]]
      row3 = ["Other", sel[state]["Other Votes"], sel[state]["Other %"],
              sel[state]["Other EV"]]

  // state name above table
  svg3.append("text")
             .attr("x", 1000)
             .attr("y", 90)
             .attr("id", "wikitip")
             .attr("class", "statTitle")
             .text(state)
             .style("font-size", "15px")

  // import foreign object into html
  var table = svg3.append("foreignObject")
                  .attr("width", 480)
                  .attr("height", 100)
                  .attr("id", "wikitip")
                  .attr("x", 1000)
                  .attr("y", 100)
                  .append("xhtml:body")

  // add the table and create rows
  var tabler = table.append("table")

  tabler.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })

  tabler.append("tr")
    .selectAll("td")
      .data(row1)
      .enter()
      .append("td")
      .text(function(d) { return d })

  tabler.append("tr")
    .selectAll("td")
      .data(row2)
      .enter()
      .append("td")
      .text(function(d) { return d })

  tabler.append("tr")
    .selectAll("td")
      .data(row3)
      .enter()
      .append("td")
      .text(function(d) { return d })
}
