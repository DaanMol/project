# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
"""

import json as j
import csv

presidents = ["Roosevelt", "Truman", "Eisenhower", "Kennedy", "Johnson", "Nixon", "Ford",
               "Carter", "Reagan", "BushSr", "Clinton", "BushJr", "Obama", "Trump"]
election_years = ["Roosevelt1940", "Roosevelt1944", "Truman1948", "Eisenhower1952",
                  "Eisenhower1956", "Kennedy1960", "Johnson1964", "Nixon1968", "Nixon1972",
                  "Carter1976", "Reagan1980", "Reagan1984", "BushSr1988", "Clinton1992",
                  "Clinton1996", "BushJr2000", "BushJr2004", "Obama2008", "Obama2012", "Trump2016"]

def parseApproval(reader):
    """
    parses csv into dict
    """

    approval = {}
    for row in reader:
        approval.update({row["Start Date"]: {"Start": row["Start Date"], "End": row["End Date"],
                                            "Approving": int(row["Approving"]), "Disapproving": int(row["Disapproving"]),
                                            "Unsure": int(row["Unsure/NoData"])}})

    if len(approval) == 2786:
        short_approval = {}
        counter = 0
        # print(approval)
        for date in approval:
            if counter % 7 == 0:
                short_approval.update({date: approval[date]})
            counter += 1
        return short_approval
    return approval

def parseCongress(reader):

    congress = {}
    for row in reader:
        years = row["\ufeffCongress (Years)"].split("(")[1].replace(")", "").replace("\u2013", "-").replace("\u00a0", "")
        congress.update({years: {"Total": row["# of House Seats"][0:3],
                        "Democrats": row["Democrats"], "Republicans": row["Republicans"]}})

    return congress

def parseVotes(reader):

    votes = {}
    for row in reader:
        state = row["\ufeffSTATES"].replace("*", "")
        Total = int(row["TOTAL VOTES"].replace(",", ""))

        if row["DemVotes"] == "--":
            DemVotes = 0
        else:
            DemVotes = int(row["DemVotes"].replace(",", ""))

        DemP = float(row["Dem%"].replace("%", ""))

        if not is_number(row["DemEV"].replace("*", "")):
            DemEV = 0
        else:
            DemEV = int(row["DemEV"].replace("*", ""))

        RepVotes = int(row["RepVotes"].replace(",", ""))
        RepP = float(row["Rep%"].replace("%", ""))

        if not is_number(row["RepEV"].replace("*", "")):
            RepEV = 0
        else:
            RepEV = int(row["RepEV"].replace("*", ""))

        if row["OtherVotes"] == "" or row["OtherVotes"] == "--":
            OtherVotes = 0
        else:
            OtherVotes = int(row["OtherVotes"].replace(",", ""))

        if row["Other%"] == "":
            OtherP = 0
        else:
            OtherP = float(row["Other%"].replace("%", ""))

        if not is_number(row["OtherEV"]):
            OtherEV = 0
        else:
            OtherEV = int(row["OtherEV"])

        votes.update({state: {"Total": Total, "Democrate Votes": DemVotes, "Democrate %": DemP,
                     "Democrate EV": DemEV, "Republican Votes": RepVotes, "Republican %": RepP,
                     "Republican EV": RepEV, "Other Votes": OtherVotes, "Other %": OtherP,
                     "Other EV": OtherEV}})

    return votes

def parseCodes(f):
    codes = {}
    for i in f:
        i = i.replace("\n", "").split("|")
        codes.update({i[0]: i[2]})
        codes.update({i[2]: i[0]})

    return codes

def parseDates(f):
    dates = {}
    for i in f:
        dates.update({i["\ufeffDate"]: {"Date" : i["\ufeffDate"], "Title": i["Title"],
                     "Link": i["Link"], "Image": i["Image"]}})

    return dates

def json(parsed, name):
    """
    Converts a dictionary to a json file
    """

    with open(f"{name}.json", "w") as write_file:
        j.dump(parsed, write_file, indent=4)

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

if __name__ == '__main__':

    final = {}
    finalvotes = {}

    for president in presidents:
        with open(f"../data/approval/{president}.csv") as file:
            reader = csv.DictReader(file)
            parsed = parseApproval(reader)
            final.update({president: parsed})

    json(final, "presidents")

    seats = {}
    with open("../data/seats/congress.csv", encoding='utf-8') as file:
        reader = csv.DictReader(file)
        parsed = parseCongress(reader)
        json(parsed, "congress")

    for year in election_years:
        with open(f"../data/votes/{year}.csv", encoding='utf-8') as file:
            reader = csv.DictReader(file)
            parsed = parseVotes(reader)
            finalvotes.update({year: parsed})

    json(finalvotes, "votes")

    f = open("../data/maps/statecodes", "r")
    parsed = parseCodes(f)
    json(parsed, "codes")

    final_dates = {}

    for president in presidents:
        with open(f"../data/Dates/{president}.csv", encoding='utf-8') as file:
            reader = csv.DictReader(file)
            parsed = parseDates(reader)
            final_dates.update({president: parsed})

    json(final_dates, "dates")
