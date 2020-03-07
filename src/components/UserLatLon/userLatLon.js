import React from 'react'
import axios from 'axios'

const userLocationDetails = axios.create()

export const osmData = (lat, lon, cb) => {
    userLocationDetails.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    )
    .then( res => {
        
        let data = res.data
        let addr = data.address
        let countyCityTownVillageHamlet = 
            addr.city 
                ? addr.city 
                : addr.town 
                    ? addr.town 
                    : addr.village 
                        ? addr.village 
                        : addr.hamlet 
                            ? addr.hamlet 
                            : addr.county 

        countyCityTownVillageHamlet.replace(/ /g,'')

        let locationInfo = {
            lev_0:addr.country_code,
            lev_1:addr.state,
            lev_2:countyCityTownVillageHamlet,
            lat:data.lat,
            lon:data.lon,
            address:addr,
            display_name:data.display_name
        }
        //addr.path = path.toLowerCase()
        console.log(locationInfo)

        cb( locationInfo )
    })
    .catch( err => cb(`Unable to find your location on Open Street Maps. Please try again! 
    --- LAT: ${lat} LON: ${lon} --- ERROR MESSAGE: `, err))
}

export const getUserLocation = cb => {

    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition( pos => {

            let lat = pos.coords.latitude.toString()
            let lon = pos.coords.longitude.toString()

            cb( lat, lon )
            
        }, error => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    cb("User denied the request for Geolocation.")
                    break
                case error.POSITION_UNAVAILABLE:
                    cb("Location information is unavailable.")
                    break
                case error.TIMEOUT:
                    cb("The request to get user location timed out.")
                    break
                case error.UNKNOWN_ERROR:
                    cb("An unknown error occurred.")
                    break
            }
        })
    }
    else {
        cb('Geolocation is not supported by this browser.')
    }
}

export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    
            let R = 6371 // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1)  // deg2rad below
            let dLon = deg2rad(lon2 - lon1)
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)

            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            let d = R * c // Distance in km
            return d ? Math.round(d * 100) / 100 : d
        }

const deg2rad = deg => ( deg * (Math.PI / 180) )

