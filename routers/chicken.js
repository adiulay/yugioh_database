const express = require('express');
const router = new express.Router();
const _ = require('lodash');
const fs = require('fs');
const hbs = require('hbs');

//main page
router.get('/CHICKEN', (request, response) => {
    response.render('chicken_main.hbs')
});

module.exports = router;