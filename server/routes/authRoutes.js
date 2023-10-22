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
            res.status(201).json({ data: req.user })
        } catch (e) {
            console.log(e);
            const error = Employee.handleError(e)
            res.status(400).json({ data: null, error })
        }
    })

// User login
router.post('/login',
    checkLoggedIn,
    passport.authenticate('login'),
    (req, res) => {
        try {
            req.user.expiresIn = req.session.cookie._expires
            res.status(200).json({ data: req.user });
        } catch (e) {
            res.status(400).json({ data: null, error: e })
        }
    }
);

// User logout
router.get('/logout', async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.session.destroy()
            res.clearCookie('connect.sid');
            res.status(200).json({ data: "Logout successful!" })
        });

        console.log(`-------> User Logged out`)
    } catch (e) {
        res.status(500).json({ data: null, error: e })
    }
})

module.exports = router