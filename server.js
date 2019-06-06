const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const axios = require('axios');
const _ = require('lodash');
const port = process.env.PORT || 8080;
const fs = require('fs');

//app imports
const { yugiohRouter } = require('./routers');

//app global server
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

app.use(yugiohRouter);

// app.use((request, response) => {
//     response.render('Error_Page.hbs');
// });

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    console.log('http://localhost:8080/')
});