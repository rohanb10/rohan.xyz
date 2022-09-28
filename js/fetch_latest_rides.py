import requests
import json
import re

# quit()
# get latest url: await firebase.storage().ref().child('refresh.json').getDownloadURL().then(f => console.log(f))
firebase = requests.get('https://firebasestorage.googleapis.com/v0/b/strava-xyz.appspot.com/o/refresh.json?alt=media&token=5fab2173-e783-4903-8a64-1502bac08e1f')
print('\nGetting data from Firebase Storage')

print('\nAuthenticating Strava...')
auth = requests.post( url = 'https://www.strava.com/oauth/token', data = firebase.json())
strava_token = auth.json()
print(json.dumps(strava_token, indent=4))

print('\nGetting 50 latest rides from Strava...')
activities = requests.get('https://www.strava.com/api/v3/activities' + '?access_token=' + strava_token['access_token'] + '&per_page=50' + '&page=1')

def stringToJson(str): 
	return json.loads('{' + re.sub(r'(\d{10}):', r'"\1":', str) + '}')

print('\nComparing to all rides previously saved... ')
with open('rides.js') as rj: 
	ride_lists = re.findall('{¿(.+?)¿}', rj.read().replace(' ', '').replace('\t', '').replace('\n', '¿'))

sf = stringToJson(ride_lists[0].replace('¿', ''))
bom = stringToJson(ride_lists[1].replace('¿', ''))

rideIDs = []
for a in activities.json():
	if not(str(a['id']) in bom) and not(str(a['id']) in sf): rideIDs.append(str(a['id']))

print('\nFound ' + str(len(rideIDs)) + ' new rides.\n')
if len(rideIDs) == 0: quit()

newRides = {}
for r in rideIDs[::-1]:
	print('Fetching ride ' + r + ' from Strava')
	ride = requests.get('https://www.strava.com/api/v3/activities/' + r + '?include_all_efforts=false' + '&access_token=' + strava_token['access_token'])
	data = ride.json()
	newRides[r] = str(data['map']['polyline']).replace(chr(92), chr(92) + chr(92))

print('\n\nSaving rides to _new_rides.txt\n\n')
with open('_new_rides.txt', 'w') as f:
	for count, (r_id, poly) in enumerate(newRides.items()):
		f.write(r_id + ': "' + poly + '"')
		if count < len(newRides.items()) - 1: f.write(',')
		f.write('\n')

print('Done!\n')