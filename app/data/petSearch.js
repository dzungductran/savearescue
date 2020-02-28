import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import { PET_SEXES, PET_AGES, PET_SIZES, PET_SPECIES } from '../data/models/pet';

// Action Types and Action Creators
const { Types, Creators } = createActions({
    searchPetRequest: ['filters'],
    searchPetSuccess: ['results', 'status'],
    setFavorites: ['favorites'],
    clearFavorites: [],
    requeryPet: [],
    setLocationSuccess: ['location'],
});
export {
    Creators as Actions,
    Types,
};

// Reducers
const INITIAL_STATE = Immutable({filters:
    { location: undefined, species: [PET_SPECIES[0]], sexes: [PET_SEXES[0]],
        sizes: [PET_SIZES[0]], ages: [PET_AGES[0]], breed: "ALL"},
        results: [], favorites: [], isLoading: true });

const setResults = (state, { results, status }) => {
    let res = state.merge({ results, status, isLoading: false });
    return res;
}

const setFavorites = (state, { favorites }) => {
    let res = state.merge({ favorites });
    return res;
}

const clearFavorites = (state) => {
    let res = state.merge({ favorites : [] });
    return res;
}

const requeryPet = (state) => {
    let res = state.merge({ isLoading: true });
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

// map our action types to our reducer functions
export const HANDLERS = {
    [Types.SEARCH_PET_REQUEST]: setFilters,
    [Types.SEARCH_PET_SUCCESS]: setResults,
    [Types.SET_FAVORITES]: setFavorites,
    [Types.CLEAR_FAVORITES]: clearFavorites,
    [Types.REQUERY_PET]: requeryPet,
    [Types.SET_LOCATION_SUCCESS]: setLocationSuccess,
};

export default createReducer(INITIAL_STATE, HANDLERS);
