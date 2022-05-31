const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Trip, TripDetail, Location } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

const upload2 = multer();
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        console.log(req.user);
        const trip = await Trip.create({
            start: req.body.start,
            end: req.body.end,
            LocationId: req.body.location,
            UserId: req.user.id
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
