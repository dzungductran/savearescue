/*
* Use Yelp API to search for Vet Clinics
*
    {
        search(term: "Veterinary Clinic",
        location: "san francisco") {
            total
            business {
                name
                rating
                review_count
                photos
                location {
                    address1
                    city
                    state
                    country
                }
                coordinates {
                    latitude
                    longitude
                }
                hours {
                    is_open_now
                }
            }
        }
    }

    https://www.yelp.com/developers/graphql/guides/intro

*/
import { showMessage} from 'react-native-messages';
import { getSearchTerm } from '../data/serviceSearch';
import { getValue, YELP_RESULTS, NUM_RESULTS, SEARCH_RADIUS } from './settings';

const TO_METERS = 1609.344;

const END_POINT_URL = 'https://api.yelp.com/v3/graphql';

const API_KEY = 'YELP_API_KEY_goes_here';

// round to the nearest 0.5
const roundHalf = num => {
    return Math.round(num*2)/2;
}

const formatInbound = (business, index) => ({
    id:  (business.coordinates && business.coordinates.longitude && business.coordinates.latitude)
        ? business.coordinates.longitude + ',' + business.coordinates.latitude + ',' + `${index}` : `${index}`,
    name: business.name,
    phone: business.phone,
    state: business.location.state,
    city:  business.location.city,
    zip: business.location.zip_code,
    address: business.location.address1,
    coordinate: {
        longitude: (business.coordinates && business.coordinates.longitude) ? business.coordinates.longitude : 0,
        latitude: (business.coordinates && business.coordinates.latitude) ? business.coordinates.latitude : 0,
    },
    is_open_now: business.hours.length ?  business.hours[0].is_open_now : false,
    is_24_hours: (business.hours.length && business.hours[0].open.length) ? business.hours[0].open[0].is_overnight : false,
    rating: roundHalf(business.rating),
    review_count: business.review_count,
    title: (business.location.address1 ? business.location.address1 + '\n' : '')
    + (business.location.city ? business.location.city : '')
    + ((business.location.city && business.location.state) ? ', ' : '')
    + (business.location.state ? business.location.state : '')
    + (((business.location.city || business.location.state) && business.location.zip_code)
    ? ' ' + business.location.zip_code : '')
    + (business.phone ? '\nphone: ' + business.phone : '')
});

// `fetch` with abstraction for API URI and settings
// strQLTest = `{business(id: "garaje-san-francisco") {name id rating url}}`
export const yelpFetch = async (params = {}) => {
    // these are used in both the try and catch
    var res = undefined;

    const term = getSearchTerm(params.term);
    const location = params.location.zipCode;
    const yelp = await getValue(YELP_RESULTS);
    // dont do Yelp search for "animal-control"
    if (yelp === "0" || !location || !location.length
        || !term.length || params.term.indexOf("animal-control") !== -1) {
        return { res, data: [] };
    }

    if (__DEV__) { console.log(params); }
    // https://www.yelp.com/developers/graphql/query/search
    var miles = await getValue(SEARCH_RADIUS);
    if (miles > 25) { miles = 24; } // cramp to max for Yelp API
    let meters =  Math.trunc(miles * TO_METERS);

    var value = await getValue(NUM_RESULTS);
    if (value > 50) { value = 50; } // cramp to max for Yelp API

    try {
        const strQuery = `{search(term: \"${term}\", location: \"${location}\", radius: ${meters}, limit: ${value}) {
            total
            business {id name phone rating review_count photos
                location {address1 city state country zip_code}
                coordinates {latitude longitude}
                hours {is_open_now open {is_overnight}}
            }
        }}`;

        //const strQuery = `{business(id: "garaje-san-francisco") {name id rating url}}`

        if (__DEV__) { console.log(strQuery); }

        //const strQLTest = `{business(id: "garaje-san-francisco") {name id rating url}}`

        res = await fetch(END_POINT_URL, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type' : 'application/graphql',
                        'Authorization' : 'Bearer ' + `${API_KEY}`,
                        'Accept-Language': 'en_US'
                    }),
                    body: `${strQuery}`
                });
        var data = await res.json();

        if (!data || !data.data || !data.data.search || !data.data.search.business)
            return { res, data: [] };

        const formattedBusiness = data.data.search.business.map(formatInbound);

        if (__DEV__) { console.log(formattedBusiness); }

        return { res, data: formattedBusiness };
    } catch (error) {
        showMessage('Network issues - Error getting business info: ' + error.message, {duration: 2000});
        return { res, data: [] };
    }
};
