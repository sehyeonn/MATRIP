//***************************
// 페이지 렌더링을 위한 라우터들
//***************************
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res, next) => {
    res.render('login');
});

module.exports = router;