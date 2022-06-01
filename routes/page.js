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
        })
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;