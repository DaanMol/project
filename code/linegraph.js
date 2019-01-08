/* Programmeerproject
 * Daan Molleman
 * 11275820
 * Presidential Cheatsheet linegraph
 */

 var presidents = ["Roosevelt", "Truman", "Eisenhower", "Kennedy", "Johnson",
                   "Nixon", "Ford", "Carter", "Raegan", "BushSr", "Clinton",
                   "BushJr", "Obama", "Trump"]

d3.select("head").append("title").text("The Presidential cheatsheet")
d3.select("body").append("h1").text("The Presidential cheatsheet")
                              .attr("class", "head")
d3.select("body").append("h2").text("Daan Molleman - 11275820")

var margin = {top: 20, right: 10, bottom: 20, left: 10};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

window.onload = function() {

  d3.json("presidents.json").then(function(data) {
    console.log(data)
  })
}

function parseData() {

}
