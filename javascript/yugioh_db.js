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

var create_deck = async (name) => {
    //checks to see if deck exists, if not add new deck
    var db = admin.firestore();
    try {
        var yugioh_db = db.collection('yugioh');

        var query = yugioh_db.where('deck_name', '==', name).get();

        return await query.then(snapshot => {
            if (snapshot.empty) {
                yugioh_db.add({
                    deck_name: name,
                    deck: []
                });
                return `Deck ${name} created! Redirecting to Home Page`
                // console.log(`Fail to find deck name: ${name}`) <-- can use this for something else
            } else {
                return `${name} is already in used.`
            }
            // snapshot.forEach(doc => {    <-- useful
            //     console.log(doc.data());
            // });

        })
    } catch (err) {
        console.log(err);
        console.log('FAIL');
        return 'FireBase is down, try again later.'
    }
};

var show_deck = async (deck_name) => {
    var db = admin.firestore();
    try {
        var list = [];

        var yugioh_db = db.collection('yugioh');

        var query = await yugioh_db.where('deck_name', '==', deck_name).get();

        if (query.empty) {
            return `Deck ${deck_name} is not found in the database.`
        } else {
            query.forEach(doc => {
                list = doc.data().deck;
            })
        }

        if (list.length === 0) {
            return `${deck_name} deck is empty, start adding cards.`
        }

        return list
    } catch (err) {
        console.log(err);
        console.log('in short, its not working')
    }
};

var list_deck = async () => {
    var db = admin.firestore();

    try {
        var list = [];

        var yugioh_db = db.collection('yugioh');

        var query = await yugioh_db.get();

        if (query.empty) {
            return false
        } else {
            query.forEach(doc => {
                // list = doc.data().deck;
                list.push({
                    deck_name: doc.data().deck_name,
                    deck_id: doc.id,
                    deck: doc.data().deck
                })
            })
        }

        return list
    } catch (err) {
        console.log(err);
        console.log('in short, its not working')
    }
};

var delete_deck = async (name) => {
    var doc_id = '';
    var db = admin.firestore();

    try {
        var yugioh_db = db.collection('yugioh');

        var query = await yugioh_db.where('deck_name', '==', name).get();

        if (query.empty) {
            return `Deck ${name} is not found in the database.`
        } else {
            query.forEach(doc => {
                doc_id = doc.id
            })
        }

        await yugioh_db.doc(doc_id).delete();

        return `Deck ${name} successfully deleted.`

    } catch (err) {
        if (err) {
            console.log(err);
            console.log('FAIL');
        }
    }
};

var delete_card = async (deck_name, card_id) => {
    var db = admin.firestore();

    try {
        var list = [];
        var doc_id = '';

        var yugioh_db = db.collection('yugioh');

        var query = await yugioh_db.where('deck_name', '==', deck_name).get();

        if (query.empty) {
            return `Deck ${deck_name} is not found in the database.`
        } else {
            var response = `Card ${card_id} not found in ${deck_name} deck.`;

            query.forEach(item => {
                list = item.data().deck;
                doc_id = item.id;
            });

            for (var i = 0; i < list.length; i++) {
                if (list[i].id === card_id.toString()) {
                    list.splice(i, 1);
                    response = `Card ${card_id} deleted.`;
                    break;
                }
            }

            await yugioh_db.doc(doc_id).update({
                deck: list
            });

            return response
        }
    } catch (err) {
        console.log(err);
        console.log('FAIL')
    }
};

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

var add_card = async (deck_name, card_id) => {
    //gets the deck name from db, if found, adds card-id
    var db = admin.firestore();
    try {
        var list = [];
        var doc_id = '';
        var counter = 0;

        var yugioh_db = db.collection('yugioh');

        var query = await yugioh_db.where('deck_name', '==', deck_name).get();

        if (query.empty) {
            return `Deck ${deck_name} is not found in the database.`
        } else {
            query.forEach(doc => {
                // console.log(doc.id);
                // console.log(doc.data().deck[3]);
                list = doc.data().deck;
                doc_id = doc.id;
            });

            if (list.length === 60) {
                return 'Maximum cards in deck is 60.'
            } else {
                var card_info = await CardInformation(_.toInteger(card_id));

                list.forEach(item => {
                    if (item.name === card_info[0].name) {
                        counter ++;
                    }
                });

                if (counter === 3) {
                    return 'Maximum is 3 cards'
                }

                if (card_info === false) {
                    return `Card ID ${card_id} not found in Database.`
                } else {
                    list.push(card_info[0]);

                    await yugioh_db.doc(doc_id).update({
                        deck: list
                    });

                    return `${card_id} ${card_info[0].name} added to ${deck_name}`
                }
            }

        }
    } catch (err) {
        console.log(err);
        console.log('FAIL')
    }
};

module.exports = {
    FindSpecific: DbSpecific,
    FindGeneral: DbGeneral,
    getCardInfo: CardInformation,
    createDeck: create_deck,
    showDeck: show_deck,
    listDeck: list_deck,
    deleteDeck: delete_deck,
    addCard: add_card,
    deleteCard: delete_card
};