# day 1
Monday
downloading necessary files and preprocessing the data

# day 2
Tuesday
Continuing the preprocessing of the data and getting it in a workable
format for the usage in javascript

# day 3
Wednesday
Created the overall timeline of the president's approval rating. User can
hover over a president's time period and see the average score. The area lights
up and a red borders lights up.
Added an individual line chart for the president's approval rating. Currently
hardcoded for Roosevelt. Dots in the chart represent the data points.

# day 4
Thursday
The individual chart now updates properly and the points move as well.
Scales update accordingly, title shows selected president.
Created a map of the USA, without a tooltip.

# day 5
Friday
Matched the state id's to their name and vice versa.
Tooltip works.
The data in votes.json now properly formatted for democrates and republicans.

# day 6
Monday
Added a table to the map of the States, showing the votes, % and EV for each
party. It updates as another state is selected, another election is selected or
when another president is selected.
Added a dropdown menu for multiple elections per president. For president Ford,
a message is shown that no elections were held, as he was the vice president of
Nixon, whom was impeached after the Watergate scandal.

# day 7
Tuesday
Added a style guide.
Added nav buttons to the individual graph for easier navigation through
presidents.
Fixing error message when a state has no data, added error message when
a state without data is clicked on the map.

# day 8
Wednesday
Fixed Image at the top right.

# day 9
Thursday
Created initial static stacked  bar chart of the congress seats for
Roosevelt.
Made the bar chart dynamic, though there still are some overlaps.
The bar chart is in front of the line and the buttons, making it impossible
to navigate using the buttons.
It works now. I had to format the dates before creating a scale.
Fixed a bunch of error messages in the console.
Added comments to new code

# day 10
Friday
Fixed overlap in the stacked bar chart of congress seats. Had to do something
with checking whether they fell out of the graph.

# day 11
Monday
Finished collecting key historical events for the individual timeline.
Converted the data into a json file.
Imported the file and added the dots on the right date, yet not on the right
height.
clicking on the dots adds an image, a short text and a button that opens
an online article.

# day 12
Tuesday
Grouped multiple html elements for better readability and accessibility.

# day 12
Wednesday
The overall timeline now shrinks when clicked. Still need a method to make it
the original size again when a button is clicked.
Now the overall timeline shows the actual approval rates on the correct data,
though the lines goes from the last date to the first date for each president,
and then jumps to the last date from the next president.

# day 13
Thursday
Started making a help icon for the graphs.
Hackathon!

# day 14
Friday
Made the tooltips for each graph.
Tried making the historical dates a rectangle in the individual graph, though
this did not look quite as I wanted to.
Need to make the graphs scale with the computer screen.
The points are now on the line in the individual chart. Thanks Jasper!
Added about page with sources

# day 15
Monday
The large timeline now shows proper data and the lines are separated.
The panels are now the proper size.
The page now scrolls down to the individual chart. This only happens for the
overall timeline because that only shows one thing. The page does not scroll
for the individual timeline because that shows more than one dataset.

# day 16
Tuesday
Reduced amount of global variables.
Changed colors of other party states to match the color of the line above.
