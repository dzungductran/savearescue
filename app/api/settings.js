import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from 'react-native-messages';

import SQLite from './database';

// change the database file to your company database
const sqLite = new SQLite('my_company.db', 'default');

export const NUM_RESULTS = "numResults";
export const SEARCH_RADIUS = "searchRadius";
export const YELP_RESULTS = "YelpResults";
export const GOOGLE_MAPS = "GoogleMaps";
export const CAROUSEL = "carousel";

export const DEFAULT_SETTINGS = {
    "numResults" : '50',
    "searchRadius" : '50',
    "YelpResults" : '1',
    "GoogleMaps" : '1',
    "carousel" : '1',
};

export const deleteFavorite = async (id) => {
    return await sqLite.deleteItem("favorites", {"fav_id":`${id}`});
}

export const deleteAllFavorites = async () => {
    return await sqLite.deleteItem("favorites");
}

export const addFavorite = async (id, species) => {
    const items = [{ "fav_id":id, "pet_type":species}];
    return await sqLite.insertItems("favorites", items);
}

export const getFavoriteIds = async (species) => {
    let condition = [
        "pet_type="+"'"+`${species}`+"'",
    ]
    const { res: fav_ids, err: err } = await sqLite.selectItems(undefined, 'favorites', ["fav_id"], condition);
    if (fav_ids && fav_ids.length) {
        return { err, fav_ids: fav_ids.map(f => f.fav_id)};
    } else {
        if (err) { showMessage(err.message, {duration: 2000}); }
        return { err, fav_ids: []};
    }
}

export const setValue = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.warn(error);
    }
    return value;
}

export const getValue = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value == null) {
            setValue(key, DEFAULT_SETTINGS[key]);
            return DEFAULT_SETTINGS[key];
        } else {
            return value;
        }
    } catch (error) {
        console.warn("Can't get data for key " + key);
        setValue(key, DEFAULT_SETTINGS[key]);
        return DEFAULT_SETTINGS[key];
    }
}
