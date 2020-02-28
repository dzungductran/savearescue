import { put, select } from 'redux-saga/effects';
import { Actions as SearchActions } from '../serviceSearch';
import { yelpFetch } from '../../api/yelpFetch';
import { serviceFetch } from '../../api/serviceFetch';
import { showMessage} from 'react-native-messages';
import { Platform } from 'react-native';
import { Actions as GlobalInitActions } from '../globals';
import { getLocation } from '../../api/geolocation';

const getFilters = state => state.serviceSearch.filters;

export function* serviceSearchSaga({ filters }) {
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
    const { err, results } = yield serviceFetch(filters);
    if (__DEV__) { console.log(err); }

    const { res, data } = yield yelpFetch(filters);
    if (__DEV__) { console.log(res); }
    yield put(SearchActions.searchServiceSuccess([...results, ...data], res));
    //yield put(SearchActions.searchServiceSuccess(data, res));
}
