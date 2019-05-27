const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

const path = './yugioh_cache.json';

setTimeout(Initiation = () => {
    try {
        if (fs.existsSync(path)) {
            console.log(`${path} is found`);
        } else {
            throw `File ${path} is not found, creating new file...`;
        }
    } catch (err) {
        console.log(err);
        fs.writeFileSync('yugioh_cache.json', "{}");
    }
}, 100);

var readFile = fs.readFileSync('yugioh_cache.json');
var fileObject = JSON.parse(readFile);

var DbSpecific = async (card_name) => {
    try{
        var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?name=${encodeURIComponent(card_name)}&sort=name`);

        var card_output = db_specific.data[0];

        var card_list = [];

        for (i=0; i < card_output.length; i++) {
            card_list.push(card_output[i].image_url)
        }
        return card_list
    } catch (err) {
        if (err.response.status === 400) {
            return ['No card matching your query was found in the database.']
        } else {
            console.log(err.response);
            return `WARNING: ADIULAY, THERE'S AN UNEXPECTED ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^`
        }
    }
};

var DbGeneral = async (card_name) => {
    try{
        var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?fname=${encodeURIComponent(card_name)}&sort=name`);

        var card_output = db_specific.data[0];

        var card_list = [];

        for (i=0; i < card_output.length; i++) {
            card_list.push(card_output[i].image_url)
        }

        return card_list
    } catch (err) {
        if (err.response.status === 400) {
            return ['No card matching your query was found in the database.']
        } else {
            console.log(err.response);
            return `WARNING: ADIULAY, THERE'S AN UNEXPECTED ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^`
        }
    }
};

module.exports = {
    FindSpecific: DbSpecific,
    FindGeneral: DbGeneral
};