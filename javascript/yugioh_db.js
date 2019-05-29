const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

const path = './yugioh_cache.json';

setTimeout(startup = () => {
    console.log('Yugioh Database is up')
}, 500);

// setTimeout(Initiation = () => {
//     try {
//         if (fs.existsSync(path)) {
//             console.log(`${path} is found`);
//         } else {
//             throw `File ${path} is not found, creating new file...`;
//         }
//     } catch (err) {
//         console.log(err);
//         fs.writeFileSync('yugioh_cache.json', "{}");
//     }
// }, 500);

// var readFile = fs.readFileSync('yugioh_cache.json');
// var fileObject = JSON.parse(readFile);

var DbSpecific = async (card_name) => {
    try{
        var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?name=${encodeURIComponent(card_name)}&sort=name`);

        var card_output = db_specific.data[0];

        var card_list = [];

        for (i=0; i < card_output.length; i++) {
            // card_list.push(card_output[i].image_url)
            card_list.push({
                image: card_output[i].image_url,
                id: card_output[i].id
            })
        }
        return card_list
    } catch (err) {
        if (err.response.status === 400) {
            return false
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
            // card_list.push(card_output[i].image_url)
            card_list.push({
                image: card_output[i].image_url,
                id: card_output[i].id
            })
        }

        return card_list
    } catch (err) {
        if (err.response.status === 400) {
            return false
        } else {
            console.log(err.response);
            return `WARNING: ADIULAY, THERE'S AN UNEXPECTED ERROR ^^^^^^^^^^^^^^^^^^^^^^^^^^^`
        }
    }
};

var CardInformation = async (id) => {

    if (_.isInteger(id)) {
        if (id > 0) {
            try{
                var db_specific = await axios.get(`https://db.ygoprodeck.com/api/v4/cardinfo.php?name=${encodeURIComponent(id)}`);

                return db_specific.data[0]
                //expected output
                //     [ { id: '60992105',
                //     name: 'Blackfeather Darkrage Dragon',
                //     type: 'Synchro Monster',
                //     desc:
                //         '1 Tuner + 1 or more non-Tuner monsters\nOnce per turn, when you take damage: You can send up to 5 cards from the top of your Deck to the Graveyard, then if any monsters were sent to the Graveyard by this effect, this card gains 400 ATK.',
                //     atk: '2800',
                //     def: '1600',
                //     level: '8',
                //     race: 'Dragon',
                //     attribute: 'DARK',
                //     set_tag: 'PGLD-EN017,',
                //     setcode: 'Premium Gold,',
                //     image_url:
                //         'https://storage.googleapis.com/ygoprodeck.com/pics/60992105.jpg',
                //     image_url_small:
                //         'https://storage.googleapis.com/ygoprodeck.com/pics_small/60992105.jpg' } ]

            } catch {
                return false
            }
        } else {
            return 'Number id cannot be negative.'
        }
    } else {
        return 'Number id must be an integer'
    }
};

// CardInformation(60992105).then((item) => {
//     console.log(item)
// }).catch((err) => {
//     if (err) {
//         console.log('error on card info')
//     }
// });

module.exports = {
    FindSpecific: DbSpecific,
    FindGeneral: DbGeneral,
    getCardInfo: CardInformation
};