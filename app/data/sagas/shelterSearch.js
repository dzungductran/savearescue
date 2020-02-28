import { put, select } from 'redux-saga/effects';
import { searchShelters } from '../../api/shelters';
import { Actions as SearchActions } from '../shelterSearch';
import { serviceFetch } from '../../api/serviceFetch';
import { yelpFetch } from '../../api/yelpFetch';
import { showMessage} from 'react-native-messages';
import { Platform } from 'react-native';
import { Actions as GlobalInitActions } from '../globals';
import { getLocation } from '../../api/geolocation';

const getFilters = state => state.shelterSearch.filters;

export function* shelterSearchSaga({ filters }) {
    if (!filters) {
        filters = yield select(getFilters);
    }

    if (!filters.location.zipCode || !filters.location.zipCode.length) {
        let nl = Platform.OS === 'ios' ? '\n' : '';
        showMessage(nl + 'Please select a zipCode for search', {duration: 1500});
        return;
    }

    let nl = Platform.OS === 'ios' ? '\n' : '';
    showMessage(nl + 'Please wait while we search...', {duration: 1500});

    // make sure we get the current location again, in the case where we moved location
    // since last time we started the app.
/* Commented out since this cause issue with if Location is not set
    try {
        const location = yield getLocation();
        if (__DEV__) { console.log(location); }
        // Should also call all other redux actions with the seme setLocationSuccess
        if (location.zipCode.length && location.zipCode !== filters.location.zipCode) {
            yield put(GlobalInitActions.setLocationSuccess( location ));
        }
    }
    catch (error) {
        if (__DEV__) { console.log(error); }
        let nl = Platform.OS === 'ios' ? '\n' : '';
        showMessage(nl + error.message + '\nPlease go to Settings and turn on location', {duration: 3000});
    }
*/
    if (__DEV__) { console.log(filters); }
    const { err, results } = yield serviceFetch(filters);   // search our database
    if (__DEV__) { console.log(err); }

//  Don't include Petfinder API
/*
    const { res, data } = yield searchShelters(filters);
    if (__DEV__) { console.log(res1, data1); }
*/
    const { res, data } = yield yelpFetch(filters);
    yield put(SearchActions.searchShelterSuccess([...results, ...data], res));
}
