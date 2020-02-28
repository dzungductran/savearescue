import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

// Action Types and Action Creators
const { Types, Creators } = createActions({
    searchShelterRequest: ['filters'],
    searchShelterSuccess: ['shelterResults', 'status'],
    requeryShelter: [],
    setLocationSuccess: ['location'],
});
export {
    Creators as Actions,
    Types,
};

// Reducers
// Reducers
const INITIAL_STATE = Immutable({filters:
    { location: undefined, term: "rescues;shelters", table: "orgsandrescues" },
        shelterResults: [], status: undefined, isLoading: false });

const setResults = (state, { shelterResults, status}) => {
    let res = state.merge({ shelterResults, status, isLoading: false });
    return res;
}

const setFilters = (state, { filters }) => {
    let res = state.merge({ filters, isLoading: true });
    return res;
}

const setLocationSuccess = (state, { location }) => {
    let res = state.merge({ filters: { ...state.filters, location }});
    return res;
}

const requeryShelter = (state) => {
    let res = state.merge({ isLoading: true });
    return res;
}

// map our action types to our reducer functions
export const HANDLERS = {
    [Types.SEARCH_SHELTER_REQUEST]: setFilters,
    [Types.SEARCH_SHELTER_SUCCESS]: setResults,
    [Types.REQUERY_SHELTER]: requeryShelter,
    [Types.SET_LOCATION_SUCCESS]: setLocationSuccess,
};

export default createReducer(INITIAL_STATE, HANDLERS);
