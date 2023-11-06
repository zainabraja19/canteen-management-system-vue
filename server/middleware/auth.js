const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401).json({ data: null, error: 'Unauthenticated.', status: 401 })
}

const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.status(401).json({ data: null, error: 'You are already logged in!', status: 401 })
    }
    next()
}

const verifyRole = (role) => {
    return function (req, res, next) {
        if (req.user.role === role) {
            next();
        } else {
            res.status(401).json({ data: null, error: "You are not Authorized to access this resource.", status: 401 })
        }
    }
}

module.exports = { checkAuthenticated, checkLoggedIn, verifyRole }