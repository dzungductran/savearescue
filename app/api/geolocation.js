import Geocoder from 'react-native-geocoder';
import { showMessage } from 'react-native-messages';
import { Platform, PermissionsAndroid } from 'react-native';

const TO_RADIAN = 0.0174532925;
const TO_DEGREE = 57.2957795;
const EARTH_RADIUS = 6371.01;
const TO_MILE = 0.621371192;
const TO_KM = 1.609344;
const TO_MILE_FROM_METER = 0.00062137

const MIN_LAT = -90*TO_RADIAN;
const MAX_LAT = 90*TO_RADIAN;
const MIN_LON = -180*TO_RADIAN;
const MAX_LON = 180*TO_RADIAN;


export function getLocation() {
    return new Promise((resolve, reject) => {
        global.navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                                        {
                                            'title': 'your_company_name Permission',
                                            'message': 'your_company_name App needs permission to location to get your current location for search'
                                        }
                                    );
                    if (!granted) {
                        showMessage('Please give location permission for better accuracy', {duration: 3000});
                        resolve({zipCode: '', latitude: pos.coords.latitude, longitude: pos.coords.longitude});
                    }
                }

                const geocoded = await Geocoder.geocodePosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                resolve({zipCode: geocoded[0].postalCode, latitude: pos.coords.latitude, longitude: pos.coords.longitude});
            } catch(error) {
                showMessage('Network error - cannot get geolocation ' + error.message, {duration: 3000});
                resolve({zipCode: '', latitude: pos.coords.latitude, longitude: pos.coords.longitude});
            }
        }, reject);
    });
}

/*
export function getLocation() {
    return new Promise((resolve, reject) => {
        global.navigator.geolocation.getCurrentPosition(
            async (pos) => {
                Geocoder.geocodePosition({lat:pos.coords.latitude, lng:pos.coords.longitude}).then(res => {
                    // res is an Array of geocoding object (see below)
                    if (__DEV__) { console.log(res) };
                    resolve({zipCode: res[0].zipCode, latitude: pos.coords.latitude, longitude: pos.coords.longitude});
                })
                .catch(err => {
                    if (__DEV__) { console.log(err) };
                    resolve({zipCode:'', latitude: pos.coords.latitude, longitude: pos.coords.longitude})
                });
            },
            async (posError) => {
                if (__DEV__) { console.log(posError); }
                reject({zipCode:'', latitude: 0, longitude: 0})
            })
        });
}
*/
/*
export function getPostalCode(latitude, longitude) {
    if (__DEV__) { console.log(latitude, longitude); }
    Geocoder.geocodePosition({
       lat: latitude,
       lng: longitude,
   }).then(res => {console.log(res); return res[0].postalCode})
   .catch(err => {console.log(err); return 0});
}
*/

export const getPostalCode = async (latitude, longitude) => {
    if (__DEV__) { console.log(latitude, longitude); }
    const geocoded = await Geocoder.geocodePosition({
        lat: latitude,
        lng: longitude,
    });

    if (__DEV__) { console.log(geocoded); }
    return geocoded[0].postalCode;
}

export function getRegionForCoordinates(points) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    if (!points || !points.length) {
        return { region: {} };
    }

    // init first point
    ((point) => {
        minX = point.coordinate.latitude;
        maxX = point.coordinate.latitude;
        minY = point.coordinate.longitude;
        maxY = point.coordinate.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = point.coordinate.latitude && Math.min(minX, point.coordinate.latitude);
        maxX = point.coordinate.latitude && Math.max(maxX, point.coordinate.latitude);
        minY = point.coordinate.longitude && Math.min(minY, point.coordinate.longitude);
        maxY = point.coordinate.longitude && Math.max(maxY, point.coordinate.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
        longitudeDelta: deltaY * 1.2,  // 20% extra so it will show in the window
        latitudeDelta: deltaX * 1.2,
        longitude: midY,
        latitude: midX
    };
}

rad = x => {
    return x * TO_RADIAN;
}

degree = x => {
    return x * TO_DEGREE;
}

Km = miles => {
    return miles * TO_KM;
}

miles = km => {
    return km * TO_MILE;
}

// pass in current long, lat and destination long, lat
export function getDistance (clng, clat, llng, llat) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(llat - clat);
    let dLong = rad(llng - clng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(rad(clat)) * Math.cos(rad(llat))
          * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c * TO_MILE_FROM_METER;
    return d; // returns the distance in miles
}

// https://gist.github.com/ederoyd46/2605218
// Distance is in KM
export function boundingCoordinates(location, distance) {
  if (!location || distance < 0) {
    console.warn("no location or distance");
    return undefined;
  }

  let distanceKm = Km(distance);
  let radLat = rad(location.latitude);
  let radLon = rad(location.longitude);
  var radius = EARTH_RADIUS;
  var radDist = distanceKm / radius;
  var minLat = radLat - radDist;
  var maxLat = radLat + radDist;

  var minLon, maxLon;

  if (minLat > MIN_LAT && maxLat < MAX_LAT) {
    var deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    minLon = radLon - deltaLon;
    if (minLon < MIN_LON) minLon += 2 * Math.PI;
    maxLon = radLon + deltaLon;
    if (maxLon > MAX_LON) maxLon -= 2 * Math.PI;
  } else {
    // a pole is within the distance
    minLat = Math.max(minLat, MIN_LAT);
    maxLat = Math.min(maxLat, MAX_LAT);
    minLon = MIN_LON;
    maxLon = MAX_LON;
  }

  var locationRange = {
                    minLat: degree(minLat)
                    , maxLat: degree(maxLat)
                    , minLon: degree(minLon)
                    , maxLon: degree(maxLon)
                   };
  return locationRange;
}
