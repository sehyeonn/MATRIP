//***************************
// 페이지 렌더링을 위한 라우터들
//***************************
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

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

module.exports = router;