// https://facebook.github.io/react-native/docs/network
import { showMessage } from 'react-native-messages';

// V2.0 API
const PETFINDER_V2_URL = "https://api.petfinder.com/v2/";
const AUTH_ENDPOINT = "oauth2/token";
const CLIENT_ID = "PetFinder_Client_Id_goes_here";
const CLIENT_SECRET = "PetFinder_Secret_goes_here";

let accessToken = null;
let lastAuthTime = Math.floor(Date.now() / 1000); // init to current time
let expireAuthTime = 0;  // no token

// Return GET query string parameters based on an object
const getQueryString = obj => (
    Object.keys(obj)
    .filter(key => !!obj[key]) // filter out empty values
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
);

// Do authetication request
const authRequest = async () => {
    // these are used in both the try and catch
    let res;
    let data;
    let authURL;
    let authObj = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'client_id': `${CLIENT_ID}`,
            'client_secret': `${CLIENT_SECRET}`,
            'grant_type': 'client_credentials'
        })
    };

    try {
        authURL = `${PETFINDER_V2_URL}${AUTH_ENDPOINT}`;
        if (__DEV__) { console.log(authURL); }

        res = await fetch(authURL, authObj);
        data = await res.json();

        accessToken = data.access_token;
        expireAuthTime = data.expires_in - 300; // minus 5 mins for slack
        lastAuthTime = Math.floor(Date.now() / 1000);
        if (__DEV__) { console.log( accessToken, expireAuthTime ); }

    } catch (error) {
        showMessage(error.message, {duration: 2000});
        console.info({ params: authObj, url: authURL, res });
        accessToken = null;
        expireAuthTime = 0; // reset to 0
    }

    if (__DEV__) { console.log( res, data ); }
    return { res, data };
}

// `fetch` with abstraction for API URI and settings
export const apiFetch2 = async (
    resource,
    { queryParams } = { queryParams: {} },
) => {
    // these are used in both the try and catch
    let res;
    let data;
    let finalParams;
    let finalURL;

    // If token expires then ask for a new token
    let currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > lastAuthTime + expireAuthTime || !accessToken) {
        const { resAuth, dataAuth } = await authRequest();
    }

    try {
        console.log(queryParams);
        // Build GET params, including API required settings
        const queryString = getQueryString(queryParams);

        // Construct URL and call resource
        let settings = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        finalURL = queryString ? `${PETFINDER_V2_URL}${resource}?${queryString}`
                               : `${PETFINDER_V2_URL}${resource}`;
        if (__DEV__) { console.log(finalURL); }

        res = await fetch(finalURL, settings);
        data = await res.json();
        if (__DEV__) { console.log(res, data) };

        // return response
        return { data, res };
    } catch (error) {
        showMessage(error.message, {duration: 2000});
        console.info({ params: finalParams, url: finalURL, res });
        return { data, res, error };
    }
};


// Expose tested methods
let _private; // eslint-disable-line import/no-mutable-exports, no-underscore-dangle
if (process.env.NODE_ENV === 'test') _private = { getQueryString };
export { _private };
