const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');

//firebase settings

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://arctic-hydrus.firebaseio.com"
});

setTimeout(startup = () => {
    console.log('Yugioh Database is up')
}, 500);

var add_document = async (data) => {
    var db = admin.firestore();
    try {
        await db.collection('yugioh').add({
            name: data
        });
        console.log('success!')
    } catch (err) {
        console.log(err);
        console.log('in short, its not working')
    }
};

var delete_document = async (data) => {
    var db = admin.firestore();
    try {
        await db.collection('yugioh').doc(data).delete();
        console.log('delete successful!')
    } catch (err) {
        console.log(err);
        console.log('in short, its not working')
    }
};

// add_document('jimmy');
// delete_document('AVCqpF5audP2Rk0NSKnUsdf');

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
            // return 'Number id cannot be negative.'
            return false
        }
    } else {
        // return 'Number id must be an integer'
        return false
    }
};



module.exports = {
    FindSpecific: DbSpecific,
    FindGeneral: DbGeneral,
    getCardInfo: CardInformation
};