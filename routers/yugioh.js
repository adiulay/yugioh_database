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
        yugioh_link: 'bg-dark'
    })
});

// router.use((request, response) => {
//     response.render('Error_Page.hbs');
// });

module.exports = router;