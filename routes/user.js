//***************************
// 사용자 정보와 관련된 라우터
//***************************
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입 처리 라우터
router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const { email, username, password } = req.body;
    try {
        // 같은 이메일의 유저가 있는지 찾아 있다면 error
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/signup?error=exist');
        }
        // 비밀번호를 암호화하여 데이터베이스에 저장
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인 처리 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;