import { put } from 'redux-saga/effects';
import { Actions as SearchActions } from '../breedSearch';
import { breedFetch } from '../../api/breedFetch';
import { showMessage} from 'react-native-messages';
import { Platform } from 'react-native';

export function* breedSearchSaga({ filters }) {
    if (__DEV__) {console.log(filters); }
    let nl = Platform.OS === 'ios' ? '\n' : '';
    showMessage(nl + 'Please wait while we search...', {duration: 1000});

    const { res, dataBlob } = yield breedFetch(filters);
    if (__DEV__) { console.log(dataBlob); }

    yield put(SearchActions.searchBreedSuccess(dataBlob, res));
}
