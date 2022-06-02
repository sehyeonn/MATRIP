//***************************
// 페이지 렌더링을 위한 라우터들
//***************************
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Location, Trip, TripDetail, Spot, sequelize } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 로그인 되어있으면 main.html 렌더링, 안되어있으면 /login으로 redirect 되어 로그인 하게 함
router.get('/', isLoggedIn, (req, res, next) => {
    const trips = [];
    res.render('main', {

        trips,
    });
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
    const location = await Location.findOne({
        where: { id: req.params.locationId },
        include: [{
            model: Spot,
            attributes: ['id', 'name', 'type', 'contents'],
        }],
    });
    res.send(location.Spots);
})

module.exports = router;