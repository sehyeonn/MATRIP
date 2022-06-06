//***************************
// 페이지 렌더링을 위한 라우터들
//***************************
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Location, Trip, TripDetail, Spot, sequelize, User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 로그인 되어있으면 main.html 렌더링, 안되어있으면 /login으로 redirect 되어 로그인 하게 함
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const trips = await Trip.findAll({
            where: { UserId: req.user.id },
            include: {
                model: Location,
                attributes: ['name'],
            }
        });
        res.render('main', {
            trips,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 로그인 화면 렌더링
router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login');
});

// 회원가입 화면 렌더링
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

// 여행지 목록을 보여주는 화면 렌더링
router.get('/location', isLoggedIn, async (req, res, next) => {
    const query = req.query.search;     // 검색어
    let locations = [];
    try {
        if(query) {     // 검색어를 입력 받으면 해당 여행지만 보여줌
            locations = await sequelize.query('SELECT * FROM locations WHERE name like "%'+ query +'%"', {
                model: Location,
                mapToModel: true
            });
        } else {
            locations = await Location.findAll();
        }
        res.render('location', {
            locations,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 선택한 여행지의 상세(기본 정보, 맛집, 관광지)를 보여주는 화면 렌더링
router.get('/location/detail/:LocationId', isLoggedIn, async (req, res, next) => {
    try {
        const location = await Location.findOne({
            where: { id: req.params.LocationId }
        });
        res.render('locationDetail', {
            title: location.name,
            location,
        })
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 해당 여행지의 관광지 리스트를 전달해주는 라우터
router.get('/spots/:locationId', isLoggedIn, async (req, res, next) => {
    try {
        const location = await Location.findOne({
            where: { id: req.params.locationId },
            include: [{
                model: Spot,
                attributes: ['id', 'name', 'type', 'contents'],
            }],
        });
        res.send(location.Spots);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 해당 여행지의 내 여행 리스트를 전달해주는 라우터
router.get('/trips/my/:locationId', isLoggedIn, async (req, res, next) => {
    try {
        const trips = await Trip.findAll({
            where: { 
                LocationId: req.params.locationId,
                UserId: req.user.id,
            },
        });
        res.send(trips);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 해당 여행지의 다른 사용자들의 여행 리스트를 전달해주는 라우터
router.get('/trips/:locationId', isLoggedIn, async (req, res, next) => {
    try {
        const trips = await Trip.findAll({
            where: { 
                LocationId: req.params.locationId,
                UserId: { [Op.not]: req.user.id },
            },
            include: [{
                model: User,
                attributes: ['username'],
            }],
        });
        res.send(trips);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 선택한 여행 상세 정보 화면 렌더링
router.get('/tripDetail/:tripId', isLoggedIn, async (req, res, next) => {
    try {
        const trip = await Trip.findOne({
            where: { id: req.params.tripId },
            include: {
                model: Location,
                attributes: ['name'],
            }
        });
        const tripDetails = await TripDetail.findAll({
            where: { TripId: req.params.tripId },
            include: [{
                model: Spot,
                attributes: ['name', 'lat', 'lng', 'type'],
            }],
            order: [
                ['date'], ['number']
            ]
        });

        const dates = [];
        let date = new Date(trip.start);
        while(date <= new Date(trip.end)) {
            dates.push(`${date.getUTCFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
            date.setDate(date.getDate() + 1);
        }

        res.render('tripDetail', {
            trip,
            tripDetails,
            dates,
            mapApiKey: process.env.MAP_API_KEY,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 내 여행 일정에서 장소 추가 클릭하면 나오는 장소 선택 페이지를 렌더링
router.get('/spot/select/:tripId/:locationId/:date', isLoggedIn, (req, res, next) => {
    res.render('selectSpot', {
        locationId: req.params.locationId,
        tripId: req.params.tripId,
        date: req.params.date,
    });
});

// 해당 관광지의 상세정보 페이지를 렌더링하는 라우터
router.get('/spot/detail/:spotId', isLoggedIn, async (req, res, next) => {
    try {
        const spot = await Spot.findOne({
            where: { id: req.params.spotId },
        });
        res.render('spotDetail', {
            spot,
            mapApiKey: process.env.MAP_API_KEY,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;