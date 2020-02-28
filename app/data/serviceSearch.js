import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

// key = search for our database
// value = search term for Yelp and also Menu display item
export const searchTerms = {
    "24-7-emergency":"24 HR EMERGENCY VETS",
    "veterinarian":"VETERINARIANS",
    "spay;neuter":"LOW COST SPAY/NEUTER",
    "animal-control":"ANIMAL CONTROLS",
    "boarding-kennels":"BOARDING KENNELS",
    "day-care":"PET DAY CARE",
    "pet-sitters":"PET SITTERS",
    "groomers":"GROOMERS",
    "trainers":"DOG TRAINERS",
    "walkers":"DOG WALKERS",
    "parks":"DOG PARKS",
    "transport":"PET TRANSPORTATION",
    "retailers":"PET RETAILERS",
    "hotels;homes":"PET FRIENDLY HOTELS"
};

const extraSearchTerms = {
    "rescues;shelters":"ANIMAL RESCUE SHELTER"
};

export const getSearchTerm = key => { return (searchTerms[key] || extraSearchTerms[key]) }

export const getDefaultTerm = () => { return Object.keys(searchTerms)[0] }

export const getSearchKey = value => {
    let values = Object.values(searchTerms);
    var index = values.indexOf(value);
    if (index === -1) index = 0;
    return Object.keys(searchTerms)[index];
}

// Action Types and Action Creators
const { Types, Creators } = createActions({
    searchServiceRequest: ['filters'],
    searchServiceSuccess: ['serviceResults', 'status'],
    requeryService: [],
    setLocationSuccess: ['location'],
});
export {
    Creators as Actions,
    Types,
};

// Reducers
// Reducers
const INITIAL_STATE = Immutable({filters:
    { location: undefined, term: getDefaultTerm(), table: "petservices" },
        serviceResults: [], status: undefined, isLoading: false });

const setResults = (state, { serviceResults, status }) => {
    let res = state.merge({ serviceResults, status, isLoading: false });
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

const requeryService = (state) => {
    let res = state.merge({ isLoading: true });
    return res;
}

// map our action types to our reducer functions
export const HANDLERS = {
    [Types.SEARCH_SERVICE_REQUEST]: setFilters,
    [Types.SEARCH_SERVICE_SUCCESS]: setResults,
    [Types.REQUERY_SERVICE]: requeryService,
    [Types.SET_LOCATION_SUCCESS]: setLocationSuccess,
};

export default createReducer(INITIAL_STATE, HANDLERS);
