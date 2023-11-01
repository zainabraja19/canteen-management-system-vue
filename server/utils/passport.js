const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Employee = require('../models/employee')

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const employee = new Employee(req.body)
                console.log(employee);
                await employee.save()
                console.log(employee);
                const emp = { ...employee.toObject() };
                console.log(emp);

                delete emp.password;
                delete emp.profilePicture
                delete emp.resume
                delete emp.__v

                return done(null, emp, { message: 'Registration Successfull' });
            } catch (error) {
                console.log("here");
                const err = Employee.handleError(error)
                console.log(err);
                return done({ message: err });
            }
        }))

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const employee = await Employee.findByCredentials(email, password)
                if (!employee) {
                    return done(null, false, { message: 'Unable to login. Please try again!' });
                }

                const emp = { ...employee.toObject() };
                delete emp.password;
                // delete emp.__v
                // if (emp.profilePicture) { delete emp.profilePicture }
                // if (emp.profilePicture) { delete emp.profilePicture }

                return done(null, emp, { message: 'Logged in Successfully' });
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((empObj, done) => {
    console.log("-----Serialize-----")
    console.log(empObj)
    done(null, empObj)
})

passport.deserializeUser((empObj, done) => {
    console.log("-----Deserialize-----")
    console.log(empObj)
    done(null, empObj)
})