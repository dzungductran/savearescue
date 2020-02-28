import R from 'ramda';
import { apiFetch2 } from './fetch';
import { getValue, NUM_RESULTS } from './settings';

const formatSearchParams = params => ({
    location: params.location.zipCode, // default location (location is required by the API
});

const formatInbound = shelter => ({
    id: shelter.id,
    name: shelter.name,
    phone: shelter.phone,
    fax: '',        // no info from petfinder api
    email: shelter.email,
    state: shelter.address.state,
    city: shelter.address.city,
    zip: shelter.address.postcode,
    address: shelter.address.address1,
    address2: shelter.address.address2,
    coordinate: {
        longitude: 0,
        latitude: 0,
    },
    is_open_now: false,
    rating: 0,
    review_count: 0,
    title: (shelter.address.address1 ? shelter.address.address1 + '\n' : '')
    + (shelter.address.city ? shelter.address.city : '')
    + ((shelter.address.city && shelter.address.state) ? ', ' : '')
    + (shelter.address.state ? shelter.address.state : '')
    + (((shelter.address.city|| shelter.address.state) && shelter.address.postcode) ? ' ' + shelter.address.postcode : '')
    + (((shelter.address.postcode && shelter.phone) || (shelter.address.postcode && shelter.email)) ? '\n' : '')
    + (shelter.phone ? 'phone: ' + shelter.phone : '')
    + ((shelter.phone && shelter.email) ? '\n' : '')
    + (shelter.email ? 'email:: ' + shelter.email : ''),
});

export const searchShelters = async (params = {}) => {
    // The API supports fetch multiple chunk
    const value = await getValue(NUM_RESULTS);
    const queryStr = {
        ...formatSearchParams(params),
        limit: value,
    };

    const { data, ...res } = await apiFetch2('organizations', {
        queryParams: queryStr
    });

    // No results
    if (!data || !data.organizations) {
        return { ...res, data: [] };
    }

    // Format them first. It's a bit slower, but we don't need to mess with the
    // API specific formatting in filters
    if (__DEV__) { console.log(data) }
    const formattedShelters = data.organizations.map(formatInbound);
    if (__DEV__) { console.log(formattedShelters) }
    return {
        ...res,
        data: formattedShelters,
    };
};

export const getShelter = async (id) => {
    const { res, data } = await apiFetch2(`organizations/${id}`, {queryParams: {}});
    if (!data || !data.organization ) {
        return { res, data: null };
    } else {
        return { res, data: formatInbound(data.organization) };
    }
};
