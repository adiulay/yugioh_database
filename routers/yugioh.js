const express = require('express');
const router = new express.Router();
const _ = require('lodash');
const fs = require('fs');
const hbs = require('hbs');

const yugioh = require('../javascript/yugioh_db');

//main page
router.get('/yugioh', (request, response) => {
    response.render('ygo_main.hbs', {
        yugioh_link: 'bg-dark',
        main: false
    })
});

//grabs specific card
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

//grabs general card, in order
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

//outputs the card info id
var card_id = '';
router.get('/yugioh/card_info/:id', async (request, response) => {
    card_information = await yugioh.getCardInfo(_.toInteger(request.params.id));
    console.log(card_information);
    card_id = request.params.id;

    response.render('ygo_card_info.hbs', {
        show_info: card_information,
        show_card: card_information,
        yugioh_link: 'bg-dark',
        card_identification: request.params.id,
        title: true,
        list_deck: await yugioh.listDeck(),
        add_button: true
    })
});

//adds card to deck name depending on what it is
router.get('/yugioh/:deck_name/:deck_id/add_card', async (request, response) => {
	var deck_name = request.params.deck_name;

	card_information = await yugioh.getCardInfo(_.toInteger(card_id));

	var add_card = await yugioh.addCard(`${deck_name}`, `${card_id}`);

    if (card_id === '') {
        // response.redirect('/yugioh')
        response.redirect('back')
    }

	if (add_card === 'Maximum cards in deck is 60.' || add_card === `Deck ${deck_name} is not found in the database.`) {
	    color = 'danger'
    } else if (add_card === 'Maximum is 3 cards') {
	    color = 'warning'
    } else {
	    color = 'success'
    }

	// console.log(add_card);

    response.render(`ygo_card_info.hbs`, {
        title: true,
        show_info: card_information,
        show_card: card_information,
        yugioh_link: 'bg-dark',
        card_identifcation: card_id,
        list_deck: await yugioh.listDeck(),
        add: true,
        add_to_deck: add_card,
        border_color: color,
        add_button: false
    })
});

//allows you to delete a card from a certain deck
router.post('/yugioh/delete/:deck_name/:card_id', async (request, response) => {
    var deck_name = request.params.deck_name;
    var card_id = request.params.card_id;
    card_information = await yugioh.getCardInfo(_.toInteger(card_id));

    var delete_card = await yugioh.deleteCard(deck_name, card_id);

    if (delete_card === `Deck ${deck_name} is not found in the database.` || delete_card === `Card ${card_id} not found in ${deck_name} deck.`) {
        color = 'danger'
    } else {
        color = 'success'
    }

    console.log(delete_card);
    response.render(`ygo_card_info.hbs`, {
        title: true,
        show_info: card_information,
        show_card: card_information,
        yugioh_link: 'bg-dark',
        card_identifcation: card_id,
        list_deck: await yugioh.listDeck(),
        add: true,
        add_to_deck: delete_card,
        border_color: color,
        add_button: false
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

router.post('/yugioh/delete_deck/:deck_name', async (request, response) => {
    var deck_name = request.params.deck_name;
    var delete_deck = await yugioh.deleteDeck(deck_name);

    // console.log(delete_deck)

    response.render("ygo_decklist.hbs", {
        deck_list_link: 'bg-dark',
        delete_deck: delete_deck,
        delete: true
    })
});

router.get('/yugioh/deck_list', async (request, response) => {
    var list_deck = await yugioh.listDeck();

    list_exist = list_deck !== false;

    // console.log(list_deck)
    // console.log(list_exist)

    response.render('ygo_decklist.hbs', {
        deck_list_link: 'bg-dark',
        deck: list_deck,
        list: list_exist
    })
});

// router.use((request, response) => {
//     response.render('Error_Page.hbs');
// });

module.exports = router;