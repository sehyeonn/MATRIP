const express = require('express');
const path = require('path');
const fs = require('fs');

const { Trip, TripDetail, Location } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// 내 여행 일정에 새로운 장소를 추가하는 라우터
router.post('/tripDetail/:tripId', isLoggedIn, async (req, res, next) => {
    // 이미 같은 번호의 장소가 있으면 다음 번호로 설정
    const numbers = await TripDetail.findAll({
        where: {
            date: new Date(req.body.selectedSpots[0].date),
            TripId: req.params.tripId,
        },
        order: [['number']],
    });
    if(Array.isArray(numbers) && numbers.length !== 0) {
        const maxNumber = numbers[numbers.length-1].number;
        req.body.selectedSpots = req.body.selectedSpots.map(spot => {
            spot.number += maxNumber;
            return spot;
        });
    }

    req.body.selectedSpots.forEach(spot => {
        // 장소 추가
        TripDetail.create({
            date: new Date(spot.date),
            number: spot.number,
            SpotId: spot.SpotId,
            TripId: req.params.tripId,
        });
    });
    res.redirect(`/tripDetail/${req.params.tripId}`);
});

// 해당 여행지의 새로운 내 여행을 추가하는 라우터
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
