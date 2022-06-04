const express = require('express');
const path = require('path');
const fs = require('fs');

const { Trip, TripDetail, Location } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/:locationId', isLoggedIn, async (req, res, next) => {
    try {
        console.log(req.user);
        const trip = await Trip.create({
            start: req.body.start,
            end: req.body.end,
            LocationId: req.params.locationId,
            UserId: req.user.id
        });
        res.redirect(`/tripDetail/${trip.id}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
