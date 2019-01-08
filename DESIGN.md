## Design Document

# Approval rate
Het eerste deel van de visualisatie zal een tijdlijn zijn met daarin de approval rate van de Amerikaanse presidenten van 1940 tot nu.
Als er één deel van de lijngrafiek wordt aangeklikt, dan zal er ingezoomd worden op de regeerperiode van deze president.
Als er ingezoomd is komen er punten op de tijdlijn te staan waar belangrijke historische gebeurtenissen worden getoond, die (mogelijk) 
invloed hebben gehad op de approval rate van de president. 
Boven de tijdlijn van de individuele president zal de gehele tijdlijn uitgezoomd staan om in te klikken waardoor de regeerperiode van een .

Voor deze visualisatie gebruik per president een csv bestand met daarin de approval rate gemeten over een bepaalde periode.
Deze 14 csv bestanden heb ik samengevoegd tot één .json bestand om te gebruiken in Javascript.

Source: [The American Presidency Project](https://www.presidency.ucsb.edu/statistics/data/presidential-job-approval)

# Senaat en Congres
Als er een president is geselecteerd, wordt de toename of afname in zetels in zowel de senaat als het congres getoond voor de partij van de
president in het jaar van de verkiezingen. Deze data wordt als achtergrond in de lijngrafiek getoond.

Deze data is online verkrijgbaar en heb ik in een csv bestand gezet, die ik ga omzetten naar een json bestand.

Source: [United states house of representatives](https://history.house.gov/Institution/Party-Divisions/Party-Divisions/)

# Electoral votes
Wanneer er een president is geselecteerd wordt er ook een kaart van de staten in de VS getoond met elk een kleur van de winnende partij, 
het aantal stemmen en het aantal kiesmannen. De data wordt getoond als de gebruiker met de muis eroverheen gaat.

Deze data is ook online te vinden en via een csv om te zetten naar een json.

Source: [The American Presidency Project](https://www.presidency.ucsb.edu/statistics/elections)

![Functie diagram](https://github.com/DaanMol/project/blob/master/images/Diagram.png)
