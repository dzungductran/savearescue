import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

export const searchColumns = "title_id;group_;weight;height;life_span;image_url";

export const breedValues = {
    "Size": {min: 0, max: 0},
    "Energy": {min: 0, max: 0},
    "Intelligence": {min: 0, max: 0},
    "Trainability": {min: 0, max: 0},
    "Hypo Allergenic": {min: 0, max: 0},
    "Shedding": {min: 0, max: 0},
    "Good with Kids": {min: 0, max: 0},
    "Good with Pets": {min: 0, max: 0},
    "Guard Dog": {min: 0, max: 0}
};

// Action Types and Action Creators
const { Types, Creators } = createActions({
    searchBreedRequest: ['filters'],
    searchBreedSuccess: ['breedResults', 'status'],
});
export {
    Creators as Actions,
    Types,
};

// Reducers
// Reducers
const INITIAL_STATE = Immutable({filters:
    { columns: searchColumns, conditions: undefined, values: breedValues },
    breedResults: [], isLoading: false });

const setResults = (state, { breedResults, status }) => {
    let res = state.merge({ breedResults, status, isLoading: false });
    return res;
}

const setFilters = (state, { filters }) => {
    let res = state.merge({ filters, isLoading: true });
    return res;
}

// map our action types to our reducer functions
export const HANDLERS = {
    [Types.SEARCH_BREED_REQUEST]: setFilters,
    [Types.SEARCH_BREED_SUCCESS]: setResults
};

export default createReducer(INITIAL_STATE, HANDLERS);
