
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../controllers/app.styles';
import { GooglePlacesAutocomplete } from '../GooglePlacesAutocomplete';

export default class GooglePlacesInput extends GooglePlacesAutocomplete {
    static defaultProps = {
        ...GooglePlacesAutocomplete.defaultProps,
        placeholder : 'Search Location',
        minLength : 2, // minimum length of text to search
        autoFocus : false,
        clearOnShow: false,
        listViewDisplayed: 'auto',    // true/false/undefined
        fetchDetails: true,
        query: {
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'Google_Places_API_KEY_goes_here',
            language: 'en', // language of the results
            types: '(cities)', // default: 'geocode'
            components: 'country:us'
        },
        iconColor: colors.primary,
        debounce: 0, // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    }
}
