# The Presidential Cheatsheet
Programmeerproject van Daan Molleman

Het doel van dit project is het visualiseren van een tijdlijn met Amerikaanse presidentiële approval rates met klikbare punten in de lijn waar de approval rate stijgt of daalt die men doorverwijst naar een relevante website.

Probleem: Vandaag de dag volgt iedereen de Amerikaanse politiek op de voet, met Trump die elke dag in het nieuws is, zij het positief of negatief. Er wordt dagelijks over gesproken en daarbij wordt dan 'de mening van het volk' genoemd. Maar hoe zit het nou daadwerkelijk met deze mening? Waar wordt deze door beïnvloed? Een belangrijk concept in de Amerikaanse politiek is de President Approval Rating, die aangeeft hoeveel procent van het volk vindt dat de president zijn baan goed uitvoert. 

De data van de approval rating is nogal abstract als het zonder context wordt weergegeven: het is slechts een lijn. Om mensen een beter inzicht te geven in de oorzaken van schommelingen in deze ratings, is het relevant om de destijdse presidentiële beslissingen weer te geven in de vorm van nieuwsberichten. 

Er zijn hiernaast ook nog verschillende typen van presidentiële besluiten, zoals economie, buitenlandse politiek en oorlogsvoering. Er kan dus ook gekeken worden welke van deze typen de meeste of minste invloed hebben op approval ratings.

Vraag: In hoeverre hebben belangrijke politieke gebeurtenissen in de VS tussen 1940 en 2018 invloed gehad op de approval rating van de destijdse president?
(Mogelijke aanpassing: kijken naar beslissingen van de presidenten op het gebied van oorlogsvoering)

![Project Sketch](https://github.com/DaanMol/project/blob/master/Images/projectsketch.png)

# Main Features

**Minimum viable product**
* Tijdlijn van de approval rates. Deze zal per president weergegeven worden met een totaalplaatje boven- of onderin.
* Klikbare punten op de tijdlijn
* Beschrijving van en link naar belangrijke gebeurtenissen en beslissingen in de vorm van krantenartikelen of presidentiële speeches of nationale archieven. 

**Optional**
* Invloed van typen beslissingen op approval rating

# Data sources 
[The American Presidency Project](https://www.presidency.ucsb.edu/statistics/data/presidential-job-approval)

[The White House Archives](https://www.archives.gov/presidential-libraries/archived-websites)

# External components
* D3 for implementing html tags 

# Similar
[The American Presidency Project](https://www.presidency.ucsb.edu/statistics/data/presidential-job-approval)
Deze website visualiseert de approval rate van elke Amerikaanse president. Je kan met de muis over de lijnen heen gaan en voor bija elke datum zien wat de rates waren. Voor mijn project is het dan nog relevant om op bepaalde plekken te kunnen klikken en doorverwezen te worden naar een relevante website.

# Hardest parts
* Het verzamelen van alle belangrijke gebeurtenissen en deze linken aan stijgingen of dalingen in de approval rate. Dit is erg veel handmatig werk en heeft weinig met programmeren te maken. 
* Voor elke president belangrijke gebeurtenissen bekijken en categoriseren. Dit wordt vooral lastig gemaakt doordat een presidentiële handeling vaak niet van één categorie is maar van meerdere.
* Voor elke categorie kijken wat voor invloed het heeft gehad. Bovendien is het nooit duidelijk of een bepaalde handeling de enige factor is die speelde bij een verandering in de approval rate. 

extra interactief html element
kaart van vs 
electoral votes?
gaten in data
bar chart typen gebeurtenissen
oorlogen vergelijken
wikipedia dbp
