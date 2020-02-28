import { put } from 'redux-saga/effects';
import { getLocation } from '../../api/geolocation';
import { Actions as GlobalInitActions } from '../globals';
import { getValue, CAROUSEL } from '../../api/settings';
import { showMessage} from 'react-native-messages';
import { Platform } from 'react-native';

export function* globalInitSaga() {

    const autoplay = yield getValue(CAROUSEL);
    if (__DEV__) { console.log(autoplay); }
    yield put(GlobalInitActions.setAutoplay( autoplay === "1" ? true : false ));

    try {
        const location = yield getLocation();
        if (__DEV__) { console.log(location); }
        // Should also call all other redux actions with the seme setLocationSuccess
        yield put(GlobalInitActions.setLocationSuccess( location ));
    }
    catch (error) {
        if (__DEV__) { console.log(error); }
        let nl = Platform.OS === 'ios' ? '\n' : '';
        showMessage(nl + error.message + '\nPlease go to Settings and turn on location', {duration: 3000});
    }
}
