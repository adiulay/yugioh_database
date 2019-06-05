const express = require('express');
const router = new express.Router();
const _ = require('lodash');
const fs = require('fs');

const yugioh = require('../javascript/yugioh_db');


router.get('/yugioh', (request, response) => {
    response.render('ygo_main.hbs', {
        yugioh_link: 'bg-dark',
        main: false
    })
});

router.post('/yugioh/YGOspecific', async (request, response) => {
    var card = request.body.specific;
    var grab_card = await yugioh.FindSpecific(card);
    // console.log(grab_card)

    var yugioh_card = {
        show_card: grab_card,
        yugioh_link: 'bg-dark',
        error: grab_card,
        main: true
    };

    response.render('ygo_main.hbs', yugioh_card)
});

router.post('/yugioh/YGOgeneral', async (request, response) => {
    var card = request.body.general;
    var grab_card = await yugioh.FindGeneral(card);

    var yugioh_card = {
        show_card: grab_card,
        yugioh_link: 'bg-dark',
        error: grab_card,
        main: true
    };

    response.render('ygo_main.hbs', yugioh_card)
});

router.get('/yugioh/card_info/:id', async (request, response) => {
    card_information = await yugioh.getCardInfo(_.toInteger(request.params.id));
    console.log(card_information);
    response.render('ygo_card_info.hbs', {
        show_info: card_information,
        show_card: card_information,
        yugioh_link: 'bg-dark',
        card_identification: request.params.id,
        title: true
    })
});

router.get('/yugioh/:id/create_new_deck', (request, response) => {
    var card_id = request.params.id;

    response.render('ygo_card_info.hbs', {
        create_deck_link: 'bg-dark',
        title: false,
        create: true,
        id_params: true,
        card_identification: card_id
    })
    // response.send('hi')
});

router.get('/yugioh/create_new_deck', (request, response) => {
    response.render('ygo_card_info.hbs', {
        create_deck_link: 'bg-dark',
        title: false,
        create: true,
        id_params: false
    })
});

router.post('/yugioh/:id/create_new_deck', async (request, response) => {
    var deck_name = request.body.deck_name;
    var card_id = request.params.id;
    var redirect = false;
    var try_again = true;
    var add_card = '';

    var create_deck = await yugioh.createDeck(`${deck_name}`);

    if (create_deck === `Deck ${deck_name} created! Redirecting to Home Page`) {
        setTimeout(startup = async () => {
            await yugioh.addCard(deck_name, card_id);
        }, 2000);
        redirect = true;
        try_again = false;
        add_card = 'Card successfully added!'
    }

    response.render('ygo_card_info.hbs', {
        create_deck_link: 'bg-dark',
        title: false,
        create: true,
        id_params: true,
        redirect: redirect,
        try_again: try_again,
        card_identification: card_id,
        output: create_deck,
        card_output: add_card
    })
});

router.post('/yugioh/create_new_deck', async (request, response) => {
    var deck_name = request.body.deck_name;
    var create_deck = await yugioh.createDeck(`${deck_name}`);

    var redirect = create_deck === `Deck ${deck_name} created! Redirecting to Home Page`;

    response.render('ygo_card_info.hbs', {
        create_deck_link: 'bg-dark',
        title: false,
        create: true,
        id_params: false,
        redirect: redirect,
        output: create_deck
    })
});

router.get('/yugioh/deck_list', (request, response) => {
    response.send('deck-list TODO')
});

// router.use((request, response) => {
//     response.render('Error_Page.hbs');
// });

module.exports = router;