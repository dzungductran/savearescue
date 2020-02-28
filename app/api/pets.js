import R from 'ramda';
import { apiFetch2 } from './fetch';
import { getValue, NUM_RESULTS } from './settings';

function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

const formatInbound = pet => ({
    id: pet.id.toString(),
    name: pet.name,
    gender: pet.gender,
    age: pet.age,
    size: pet.size,
    type: pet.type,
    breeds: [pet.breeds.primary, pet.breeds.secondary],
    description: pet.description ? decodeEntities(pet.description) : null,
    contact: {
        phone: pet.contact.phone,
        email: pet.contact.email,
        state: pet.contact.address.state,
        city: pet.contact.address.city,
        zip: pet.contact.address.postcode,
        address: pet.contact.address.address1,
        address2: pet.contact.address.address2,
    },
    photos: pet.photos ? pet.photos : [],
    title: (pet.contact.address.address1 ? pet.contact.address.address1 + '\n' : '')
    + (pet.contact.address.city ? pet.contact.address.city : '')
    + ((pet.contact.address.city && pet.contact.address.state) ? ', ' : '')
    + (pet.contact.address.state ? pet.contact.address.state : '')
    + (((pet.contact.address.city || pet.contact.address.state) && pet.contact.address.postcode)
                                ? ' ' + pet.contact.address.postcode : '')
    + (((pet.contact.address.postcode && pet.contact.phone)
                            || (pet.contact.address.postcode && pet.contact.email)) ? '\n' : '')
    + (pet.contact.phone ? 'phone: ' + pet.contact.phone : '')
    + ((pet.contact.phone && pet.contact.email) ? '\n' : '')
    + (pet.contact.email ? 'email:: ' + pet.contact.email : ''),

});

const formatSearchParams = params => ({
    location: params.location.zipCode, // default location (location is required by the API
    type: params.species ? params.species.join(",") : null,
    breed: (params.breed && params.breed !== "ALL") ? params.breed : null,
    gender: params.sexes ? params.sexes.join(",") : null,
    size: params.sizes ? params.sizes.join(",") : null,
    age: params.ages ? params.ages.join(",") : null,
});

export const searchPets = async (params = {}) => {
    // The API doesn't offer multiselect filtering
    const value = await getValue(NUM_RESULTS);

    const queryStr = {
        ...formatSearchParams(params),
        limit: value,
    };
    if (__DEV__) { console.log (queryStr); }

    const { data, ...res } = await apiFetch2('animals', {
        queryParams: queryStr
    });

    // No results
    if (!data || !data.animals ) {
        return { ...res, data: [] };
    }

    // Format them first. It's a bit slower, but we don't need to mess with the
    // API specific formatting in filters
    const formattedPets = data.animals.map(formatInbound);
    if (__DEV__) { console.log(formattedPets) }

    return {
        ...res,
        data: formattedPets,
    };
};


export const getPet = async (id) => {
    const { res, data } = await apiFetch2(`animals/${id}`, {queryParams: {}});
    if (!data || !data.animal ) {
        return { res, data: null };
    } else {
        return { res, data: formatInbound(data.animal) };
    }
};
