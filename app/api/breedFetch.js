// Search internal database
import SQLite from './database';
import { showMessage } from 'react-native-messages';

// change the database file to your company database
const sqLite = new SQLite('my_company.db', 'default');

const formatter = data => {
    // We're sorting by alphabetically so we need the alphabet
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Need somewhere to store our data
    const dataBlob = [];

    // Each section is going to represent a letter in the alphabet so we loop over the alphabet
    for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
        // Get the character we're currently looking for
        const currentChar = alphabet[sectionId];

        // Get pet whose name starts with the current letter
        const breeds = data.filter((breed) => breed.title_id.toUpperCase().indexOf(currentChar) === 0);

        // If there are any pet who have a name starting with the current letter then we'll
        // add a new section otherwise we just skip over it
        if (breeds.length > 0) {
            // Loop over the valid pet for this section
            dataBlob.push({ title: currentChar, data: breeds });
        }
    }
    if (__DEV__) { console.log( dataBlob ); }

    return { dataBlob };
}

// popularity = hypo-Allergenic
// watch_dog = good with other pets
createConditions = values => {
    var conditions = [];
    for (label of Object.keys(values)) {
        let value = values[label];
        if (value.max || value.min) {
            let column = label.replace(/ /g, "");   // remove all spaces
            if (value.max && value.min) {
                conditions.push("("+column+">="+value.min+" AND "+column+"<="+value.max+")");
            } else {
                conditions.push(column+"="+(value.min ? value.min : value.max));
            }
        }
    }
    if (__DEV__) { console.log(conditions); }
    return conditions;
}

export const breedFetch = async (params = {}) => {
    let conditions = params.conditions ? params.conditions.split(";") : [];
    let columns = params.columns;
    let moreConditions = params.values ? createConditions(params.values) : [];

    const { res: resultsSel, err: err } = await sqLite.selectItems(undefined, 'dogs',
                                                columns ? columns.split(";") : '*',
                                                [...conditions, ...moreConditions]);
    if (__DEV__) { console.log(resultsSel); }
    if ( resultsSel && resultsSel.length ) {
        const { dataBlob } = formatter(resultsSel);
        return { err, dataBlob };
    } else {
        if (err) { showMessage(err.message, {duration: 2000}); }
        return { err, dataBlob:[] };
    }
}
