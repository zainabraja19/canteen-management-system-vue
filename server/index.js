const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const { checkAuthenticated, verifyRole } = require("./middleware/auth");
const app = express();
require("dotenv").config();
// const { createInvoice } = require("./api/helpers");
const port = process.env.PORT;
const authRoutes = require("./api/routes/auth/authRoutes");
const adminRoutes = require("./api/routes/admin/adminRoutes");
const employeeRoutes = require("./api/routes/employee/employeeRoutes");

mongoose.connect("mongodb://127.0.0.1:27017/canteenDB").then(() => {
    console.log("Connected to DB!");
});

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));

app.use(express.json());

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3 * 60 * 60 * 1000,
            secure: false,
            httpOnly: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

require("./api/helpers/passport");
// Routes
// app.use('/auth', require('./route/authRoutes'));
// app.use(
//     '/employee',

//     require('./route/empRoutes')
// );
// app.use(
//     '/admin',
//     checkAuthenticated,
//     verifyRole('admin'),
//     require('./route/adminRoutes')
// );
app.use("/auth", authRoutes);
app.use("/admin", checkAuthenticated, verifyRole("admin"), adminRoutes);
app.use(
    "/employee",
    checkAuthenticated,
    verifyRole("employee"),
    employeeRoutes
);

// Error handler to catch undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        data: null,
        error: `Route not found - ${req.originalUrl}`,
        status: 404,
    });
});

// Error handler
app.use((err, req, res, next) => {
    if (err.message) {
        return res
            .status(401)
            .json({ data: null, error: err.message, status: 401 });
    }

    return res
        .status(500)
        .json({ data: null, error: "Internal Server Error", status: 500 });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}!`);
});
