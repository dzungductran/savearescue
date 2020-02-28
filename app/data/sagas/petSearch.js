import { put, select } from 'redux-saga/effects';
import { searchPets, getPet } from '../../api/pets';
import { getFavoriteIds } from '../../api/settings';
import { Actions as PetActions } from '../petSearch';
import { showMessage} from 'react-native-messages';
import { Platform } from 'react-native';
import { Actions as GlobalInitActions } from '../globals';
import { getLocation } from '../../api/geolocation';

const getFilters = state => state.petSearch.filters;

export function* petSearchSaga({ filters }) {
    if (!filters) {
        filters = yield select(getFilters);
    }
    if (__DEV__) {console.log(filters); }

    if (!filters.location.zipCode || !filters.location.zipCode.length) {
        let nl = Platform.OS === 'ios' ? '\n' : '';
        showMessage(nl + 'Please select a zipCode for search', {duration: 1500});
        return;
    }

    const { err, fav_ids } = yield getFavoriteIds(filters.species);

    let nl = Platform.OS === 'ios' ? '\n' : '';
    showMessage(nl + 'Please wait while we search...', {duration: 2500});

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
    // Search pets
    const { res, data } = yield searchPets(filters);
    if (__DEV__) { console.log (res); }

    if (fav_ids && fav_ids.length) {
        var favorites = [];
        for (f of fav_ids) {
            found = data.find(pet => pet.id === f );
            if (__DEV__) { console.log(found); }
            if (!found) {
                const { data: pet } = yield getPet(f);
                if (pet) {
                    favorites.push(pet);
                } else {
                    // TODO: We need to delete pet that has been gone
                }
            } else {
                favorites.push(found);
            }
        }

        // put pet favorites
        yield put(PetActions.setFavorites(favorites));
    } else {
        yield put(PetActions.setFavorites([]));
    }

    // put pet serach results
    yield put(PetActions.searchPetSuccess(data, res));
}
