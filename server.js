const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const axios = require('axios');
const _ = require('lodash');
const port = process.env.PORT || 8080;
const fs = require('fs');

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

app.post('/YGOspecific', (request, response) => {
    output_card = [
        'output',
        'should',
        'look',
        'like',
        'this'
    ];

    var yugioh_card = {
        show_card: output_card,
        yugioh_link: 'active'
    };

    response.render('ygo_main.hbs', yugioh_card)
});

app.post('/YGOgeneral', (request, response) => {
    output_card = [
        'this',
        'should',
        'look',
        'like',
        'this'
    ];

    var yugioh_card = {
        show_card: output_card,
        yugioh_link: 'active'
    };

    response.render('ygo_main.hbs', yugioh_card)
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});