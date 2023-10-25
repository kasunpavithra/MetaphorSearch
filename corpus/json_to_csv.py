import json
import csv

# Open the JSON file and load the data
with open('song.json', 'r') as f:
    data = json.load(f)

# Open a CSV file for writing
with open('corpus.csv', 'w', newline='') as f:
    # Create a CSV writer
    writer = csv.writer(f)
    # Write the headers
    writer.writerow(data[0].keys())
    # Write the data rows
    for row in data:
        writer.writerow(row.values())
