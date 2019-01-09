# Daan Molleman
# 11275820

"""
This script converts a csv file to a JSON file
"""

import json as j
import csv

presidents = ["Roosevelt", "Truman", "Eisenhower", "Kennedy", "Johnson", "Nixon", "Ford", \
               "Carter", "Raegan", "BushSr", "Clinton", "BushJr", "Obama", "Trump"]

def parseApproval(reader):
    """
    parses csv into dict
    """

    approval = {}
    for row in reader:
        approval.update({row["Start Date"]: {"Start": row["Start Date"], "End": row["End Date"],
                                            "Approving": row["Approving"], "Disapproving": row["Disapproving"],
                                            "Unsure": row["Unsure/NoData"]}})
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

def json(parsed, name):
    """
    Converts a dictionary to a json file
    """

    with open(f"{name}.json", "w") as write_file:
        j.dump(parsed, write_file, indent=4)

if __name__ == '__main__':

    final = {}

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
