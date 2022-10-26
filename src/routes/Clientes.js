const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isClient } = require('../lib/auth');


// Donde puede el cliente mira su cuenta
router.get('/Panel',isClient ,(req, res) => {
    res.render('Cliente/Panel');
});



module.exports = router;