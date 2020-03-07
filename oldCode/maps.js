
//const degrees = require('./toDegrees')

exports.geoMatx = ( app, jsonParser ) => {

	const googleMapsClient = require('@google/maps').createClient({
		key: 'AIzaSyDDXLUFUkCAMPzSN-9Cnbm-L5MwXJGvHm4'
	});

	app.post('/revGeoCode', jsonParser, ( req, res ) => {

		if ( !req.body ) return res.sendStatus(400)

		googleMapsClient.reverseGeocode({

			latlng: req.body.latLon

		},
		( err, response ) => {
			if ( err ) { console.log('revGeoCode err', err); return; }

			const getPath = {}
			response.json.results[0].address_components.forEach( v => {

				let area = v.types[0]

				if ( area === 'country' ) { getPath.country = v.short_name || null }
				else if ( area === 'administrative_area_level_1' ) { getPath.level_1 = v.short_name || null }
				else if ( area === 'administrative_area_level_2' ) { getPath.level_2 = v.short_name || null }
				else if ( area === 'locality' ) { getPath.locality = v.short_name || null }
				else if ( area === 'route' ) { getPath.route = v.short_name || null }
				else if ( area === 'street_number' ) { getPath.streetNum = v.short_name || null }
			})
			//console.log(response.json.results[0].address_components);
			res.send( getPath )
		})
	})

	app.post('/distMatx', jsonParser, ( req, res ) => {
		if (!req.body) return res.sendStatus(400)

		googleMapsClient.distanceMatrix({
			origins: req.body.orig,
			destinations: req.body.dest,
			mode: 'driving',
			units: 'metric'

		}, ( err, response ) => {
			if (err) { console.log('distMatx err', err); return; }

			const mapData = []
			//const mapDist = 5000

			response.json.rows[0].elements.forEach( v => {

				//let deg = Math.round(degrees(req.body.orig[0], req.body.dest)),
				//dist = v.distance.value / (mapDist / 50)
				//dist = 50 - dist // start from center 50%

				mapData.push(
					{
						//deg,
						//dist,
						distMatx:v,
						distTxt: v.distance.text,
						distVal: v.distance.value,
						durTxt: v.duration.text,
						durVal: v.duration.value
					})
			})

			mapData.sort((a, b) => { return a.distVal - b.distVal }).map(( v, i ) => { v.index = i })

			res.send( mapData )

		})
	})
}
