import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

// Action Types and Action Creators
const { Types, Creators } = createActions({
    setLocationSuccess : ['location'],
    initRequest: [],
    setDatabase:['database', 'status'],
    setAutoplay: ['autoplay']
});
export {
    Creators as Actions,
    Types,
};

// Reducers
// Reducers
const INITIAL_STATE = Immutable( {
    location: { zipCode: undefined, latitude: undefined, longitude: undefined },
    database: { fileName: undefined, isLoaded: false },
    autoplay: false,
    res: undefined
});

const setLocationSuccess = (state, { location }) => {
    let res = state.merge({ location, isLoading: false });
    return res;
}

const initRequest = (state ) => state.merge({ isLoading: true });

const setAutoplay = (state, { autoplay }) => state.merge({ autoplay });

const setDatabase = (state, { database, res }) => state.merge({ database, res });

// map our action types to our reducer functions
export const HANDLERS = {
    [Types.SET_LOCATION_SUCCESS]: setLocationSuccess,
    [Types.INIT_REQUEST]: initRequest,
    [Types.SET_DATABASE]: setDatabase,
    [Types.SET_AUTOPLAY] : setAutoplay,
};

export default createReducer(INITIAL_STATE, HANDLERS);
