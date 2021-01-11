import json
from time import strftime, strptime

with open('shows.json') as f:
    data = json.load(f)

def getTimes(times):
    for i in range(len(times)):
        time = strftime("%I:%M %p", times[i])
        if time[0] == "0":
            times[i] = time[1::]
        else:
            times[i] = time

times = sorted(set(strptime(data[show]['time'], "%I:%M %p") for show in data))
low = times[0]
high = times[-1]

getTimes(times)

with open('compact.json', 'w') as file:
    json.dump([None] + times, file, indent=4)

times = set(times)
for time in range(1, 13):
    times.add(f"{time}:00 AM")
    times.add(f"{time}:30 AM")
    times.add(f"{time}:00 PM")
    times.add(f"{time}:30 PM")

times = sorted([strptime(time, "%I:%M %p") for time in times])
full = list(times)

getTimes(times)

with open('full.json', 'w') as file:
    json.dump([None] + times, file, indent=4)

times = [time for time in full if low <= time <= high]

getTimes(times)

with open('cutoff.json', 'w') as file:
    json.dump([None] + times, file, indent=4)
