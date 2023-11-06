const router = require('express').Router();
const Employee = require('../models/employee')
const passport = require('passport');
const { checkAuthenticated, checkLoggedIn } = require('../middleware/auth')

// User registration
router.post('/signup',
    checkLoggedIn,
    passport.authenticate('signup'),
    async (req, res) => {
        try {
            req.user.expiresIn = req.session.cookie._expires
            res.status(201).json({ data: req.user, status: 201 })
        } catch (error) {
            res.status(400).json({ data: null, error: error.message, status: 400 })
        }
    })

// User login
router.post('/login',
    checkLoggedIn,
    passport.authenticate('login'),
    (req, res) => {
        try {
            req.user.expiresIn = req.session.cookie._expires
            res.status(200).json({ data: req.user, status: 200 });
        } catch (error) {
            console.log(error);
            res.status(400).json({ data: null, error: error, status: 400 })
        }
    }
);

// User Auto Login
router.get('/autoLogin', (req, res) => {
    try {
        // req.user.expiresIn = req.session.cookie._expires
        res.status(200).json({ data: req.user ? req.user : null, status: 200 });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 })
    }
})

// User logout
router.get('/logout', async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.session.destroy()
            res.clearCookie('connect.sid');
            res.status(200).json({ data: "Logout successful!", status: 200 })
        });

        console.log(`-------> User Logged out`)
    } catch (error) {
        res.status(400).json({ data: null, error: error.message, status: 400 })
    }
})

module.exports = router