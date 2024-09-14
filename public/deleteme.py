import csv
import random
from datetime import datetime, timedelta

# Function to generate a random timestamp
def random_timestamp():
    start_date = datetime(2024, 1, 1)
    random_days = random.randint(0, 30)
    random_seconds = random.randint(0, 86400)  # Number of seconds in a day
    random_date = start_date + timedelta(days=random_days, seconds=random_seconds)
    return random_date.strftime('%Y-%m-%d %H:%M:%S')

# Function to generate a random bib number
def random_bib():
    return random.randint(100, 999)

# Function to generate a random timing point
def random_timing_point():
    return random.choice(['START', 'FINISH'])

# Function to generate a random device ID
def random_device_id():
    return random.randint(10, 20)

# Number of lines to generate
num_lines = 500  # Change this value to generate more or fewer lines

# Generate sample data
sample_data = [
    {
        'id': i + 1,
        'deviceId': random_device_id(),
        'timingPoint': random_timing_point(),
        'bib': random_bib(),
        'timestamp': random_timestamp()
    }
    for i in range(num_lines)
]

# Define the CSV file headers
headers = ['id', 'deviceId', 'timingPoint', 'bib', 'timestamp']

# Write the sample data to a CSV file
with open('sample_data.csv', mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()
    writer.writerows(sample_data)

print(f'CSV file with {num_lines} lines created successfully.')