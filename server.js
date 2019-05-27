const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const axios = require('axios');
const _ = require('lodash');
const port = process.env.PORT || 8080;
const fs = require('fs');

const yugioh = require('./javascript/yugioh_db');

var app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index.hbs', {
        home_link: 'active'
    });
});

app.get('/yugioh', (request, response) => {
    response.render('ygo_main.hbs', {
        yugioh_link: 'active'
    })
});

app.post('/yugioh/YGOspecific', async (request, response) => {
    var card = request.body.specific;
    var grab_card = await yugioh.FindSpecific(card);
    // console.log(grab_card)

    var yugioh_card = {
        show_card: grab_card,
        yugioh_link: 'active'
    };

    response.render('ygo_main.hbs', yugioh_card)
});

app.post('/yugioh/YGOgeneral', async (request, response) => {
    var card = request.body.general;
    var grab_card = await yugioh.FindGeneral(card);

    var yugioh_card = {
        show_card: grab_card,
        yugioh_link: 'active'
    };

    response.render('ygo_main.hbs', yugioh_card)
});

app.use((request, response) => {
    response.render('Error_Page.hbs');
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    console.log('http://localhost:8080/')
});