# Final Report

The web application presents the user with an insight into the approval rating
of the President of the United States of America from 1940 until 2018.
An overall timeline shows the progression of the approval rate over all the 78
years, and clicking a segment of that graph will generate an individual timeline
for a single president, while also displaying the division of seats in the
house of Congress. Historical events are plotted on the individual line, giving
an idea of the influence they may have had on the approval rate. When clicked,
an image of the event appears with a clickable link to an online article.
Lastly, a map of the elections is shown, visualising the distribution of votes
between states. Clicking a state will show its statistics and if a president
had more than one election, it is selectable through a dropdown menu.

[Single Screenshot](https://github.com/DaanMol/project/blob/master/doc/total.png)

## Technical design
The code is structured in functions, with one main function that loads the
parts of the page that need to be there when it loads. When the page loads,
all the datasets are promised and loaded into variables, then, the data is used
in the main function to draw the initial visual components. These include the
overall timeline and the individual timeline for president Roosevelt, since he
was the president in 1940.

The data consists of 5 json files and one topojson file. The largest file is
presidents.json, containing dates with approval rates for each president.
Congress.json contains data about the seat division in the house of Congress.
Votes.json provides data of the amount of votes and electoral votes in each
American state, making it possible to colour in the map. Codes.json is a file
that decyphers the ANSI state codes to their actual names and vice versa. The
dates.json file contains a date, an image, a title and a link for each
historical event. Finally the file to draw the states is retrieved from a link
to a topojson file.

Before anything is drawn, the formats of the data need some small adjustments.
Most of which are converting the generally used mm/dd/yyyy format to a
Javascript date format. This happens in the functions: formatDate, formatDates,
formatYear. Furthermore, for the stacked bar chart representing the seats in
congress not to overlap the individual line, it has to be drawn first using
the date scale from presidents.json. The scale is constructed using the dates
from the approval rate, and the congress years are drawn using their dates on
the scale created earlier. The drawOpening function draws the overall timeline
with its selection panels, that change the individual timeline when clicked.

The individual graph is drawn with drawPres and initially shows Roosevelts data.
With the selection of another president, the scales are updated and the line
adjusts accordingly, along with the historical points and the seats in congress.
At the same time the map is updated using drawMap, loading in the map and
assigning a colour to each state representing the party that received the most
votes. 
