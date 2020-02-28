import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import petSearch, { Types as PetSearchTypes } from './petSearch';
import shelterSearch, { Types as ShelterSearchTypes } from './shelterSearch';
import serviceSearch, { Types as ServiceSearchTypes } from './serviceSearch';
import breedSearch, { Types as BreedSearchTypes } from './breedSearch';
import globals, { Types as GlobalInitTypes } from './globals';
import { petSearchSaga } from './sagas/petSearch';
import { shelterSearchSaga } from './sagas/shelterSearch';
import { serviceSearchSaga } from './sagas/serviceSearch';
import { breedSearchSaga } from './sagas/breedSearch';
import { globalInitSaga } from './sagas/globals';

// Reducers
const rootReducer = combineReducers({
    petSearch,
    shelterSearch,
    serviceSearch,
    breedSearch,
    globals,
});

// Sagas
const rootSaga = function* rootSaga() {
    yield [
        takeLatest(GlobalInitTypes.INIT_REQUEST, globalInitSaga),
        takeLatest(ShelterSearchTypes.SEARCH_SHELTER_REQUEST, shelterSearchSaga),
        takeLatest(ShelterSearchTypes.REQUERY_SHELTER, shelterSearchSaga),
        takeLatest(PetSearchTypes.SEARCH_PET_REQUEST, petSearchSaga),
        takeLatest(PetSearchTypes.REQUERY_PET, petSearchSaga),
        takeLatest(ServiceSearchTypes.SEARCH_SERVICE_REQUEST, serviceSearchSaga),
        takeLatest(ServiceSearchTypes.REQUERY_SERVICE, serviceSearchSaga),
        takeLatest(BreedSearchTypes.SEARCH_BREED_REQUEST, breedSearchSaga),
    ];
};

// Allow debugging redux actions via the redux devtools
/* eslint-disable no-underscore-dangle */
const middlewareComposer = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
/* eslint-enable */

const sagaMiddleware = createSagaMiddleware();

// Initialize our store
const store = createStore(rootReducer, middlewareComposer(
    applyMiddleware(sagaMiddleware),
));

// Start our generator functions for async action flows
sagaMiddleware.run(rootSaga);

export default store;
