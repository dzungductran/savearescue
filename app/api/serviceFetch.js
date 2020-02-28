// Search internal database
import SQLite from './database';
import { boundingCoordinates } from './geolocation';
import { getValue, NUM_RESULTS, SEARCH_RADIUS } from './settings';
import { showMessage } from 'react-native-messages';

// change the database file to your company database
const sqLite = new SQLite('my_company.db', 'default');

const formatter = (record, index) => ({
    id:  record.location__lng + ',' + record.location__lat + ',' + `${index}`,
    name: record.post_title,
    phone: record.contact__phone,
    email: record.contact__email,
    state: record.location__state,
    city:  record.location__city,
    zip: record.location__zip_id,
    address: record.location__address,
    coordinate: {
        longitude: parseFloat(record.location__lng),
        latitude: parseFloat(record.location__lat),
    },
    is_open_now: (record.category.indexOf('24') !== -1) ? true : false,
    is_24_hours: (record.category.indexOf('24') !== -1) ? true : false,
    rating: 0,
    review_count: 0,
    title: (record.location__address ? record.location__address + '\n' : '')
    + (record.contact__phone ? 'phone: ' + record.contact__phone : '')
});

export const serviceFetch = async (params = {}) => {
    const terms = params.term.split(";");
    const zipCode = params.location.zipCode;
    const table = params.table;
    if (__DEV__) { console.log(params); }

    const miles = await getValue(SEARCH_RADIUS);

    // find all range within 50 miles
    const locationRange = boundingCoordinates(params.location, parseInt(miles, 10));
    if (__DEV__) { console.log(locationRange); }

    // select * from zipcodes where latitude < 38.50949172744621 AND latitude > 37.062176168945314
    // AND longitude > -123.32209868628388 AND longitude < -121.49073497807866;
    let zipConditions = [
        "latitude<"+`${locationRange.maxLat}`,
        "latitude>"+`${locationRange.minLat}`,
        "longitude<"+`${locationRange.maxLon}`,
        "longitude>"+`${locationRange.minLon}`
    ]
    var { res: resultsZip, err: errZip } = await sqLite.selectItems(undefined, 'zipcodes', ["zipcode_id"], zipConditions);
    if (!resultsZip || !resultsZip.length) {
        resultsZip = [];
        resultsZip.push({zipcode_id: zipCode});
    }

    let sqlZipStr = resultsZip.reduce((sqlSegment, term, index, arr) => (
        `${sqlSegment} '${term.zipcode_id}' ${index + 1 !== arr.length ? ',' : '' }`
    ), 'location__zip_id IN (') + ')';
    if (__DEV__) { console.log(sqlZipStr); }

    let sqlStr = terms.reduce((sqlSegment, term, index, arr) => (
        `${sqlSegment} category LIKE '%${term}%' ${index + 1 !== arr.length ? 'OR' : arr.length > 1 ? ')' : ''}`
    ), terms.length > 1 ? '(' : '');
    if (__DEV__) { console.log(sqlStr); }

    const value = await getValue(NUM_RESULTS);

    let condition = [sqlStr, sqlZipStr];
    const { res: resultsSel, err: err } = await sqLite.selectItems(formatter, table, '*', condition,
                                                        parseInt(value, 10), 1, 'category');
    if (__DEV__) { console.log(resultsSel); }

    if (resultsSel && resultsSel.length) {
        return { err, results: resultsSel };
    } else {
        if (err) { showMessage(err.message, {duration: 2000}); }
        return { err, results: [] };
    }
}
