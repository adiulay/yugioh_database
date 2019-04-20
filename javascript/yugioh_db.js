const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

setTimeout(Initiation = () => {
    console.log('yugioh_db loaded');
}, 500);

var DbSpecific = async (card_name) => {
    try{
        var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?name=${encodeURIComponent(card_name)}`);

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
        var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?fname=${encodeURIComponent(card_name)}`);

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