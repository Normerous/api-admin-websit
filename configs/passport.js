const passport = require('passport'),
  passportJWT = require("passport-jwt"),
  ExtractJWT = passportJWT.ExtractJwt,
  JWTStrategy = passportJWT.Strategy,
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require("bcrypt"),
  { User } = require("../models/index");

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    User.findOne({ email }, (err, result) => {
      if (err || !result) return done(err, false, { message: 'Incorrect email or password.' });

      if (!bcrypt.compareSync(password, result.password))
      done(null, false, { msg: "Password is incorrect." });

      return done(null, {
        id_user: result._id,
        email: result.email,
      }, { message: 'Logged In Successfully' })
    });
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
},
  async (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
    } catch (error) {
      return done(error, false);
    }
  }, e => {
    console.log("e", e)
  }
));