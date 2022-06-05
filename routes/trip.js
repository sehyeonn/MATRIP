const express = require('express');
const path = require('path');
const fs = require('fs');

const { Trip, TripDetail, Location } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// 내 여행 일정에 새로운 장소를 추가하는 라우터
router.post('/tripDetail/:tripId', isLoggedIn, async (req, res, next) => {
    try {
        // 이미 같은 번호의 장소가 있으면 다음 번호로 설정
        const numbers = await TripDetail.findAll({
            where: {
                date: new Date(req.body.selectedSpot.date),
                TripId: req.params.tripId,
            },
            order: [['number']],
        });
        if(Array.isArray(numbers) && numbers.length !== 0) {
            const maxNumber = numbers[numbers.length-1].number;
            req.body.selectedSpot.number += maxNumber;
        }

        // 장소 추가
        await TripDetail.create({
            date: new Date(req.body.selectedSpot.date),
            number: req.body.selectedSpot.number,
            SpotId: req.body.selectedSpot.SpotId,
            TripId: req.params.tripId,
        });

        res.redirect(`/tripDetail/${req.params.tripId}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/tripDetail/:tripDetailId', isLoggedIn, async (req, res, next) => {
    try {
        await TripDetail.destroy({
            where: { id: req.params.tripDetailId },
        });
        res.redirect(`/tripDetail/${req.body.tripId}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
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
