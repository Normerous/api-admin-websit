const router = require('express').Router(),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    bcrypt = require("bcrypt");
const { User } = require("../models/index");

router.route('/login').post((req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err) return next(err)

        if (user) {
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: 36000,
            });
            return res.json({ user, token, msg: info.message })
        } else {
            return res.status(422).json(info);
        }

    })(req, res, next);
});

router.route('/register').post((req, res, next) => {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    bcrypt.hash(password, 10).then((hash, err) => {
        if (err)
          return res.status(400).json({ status: "error", msg: "Register Fail." });
        newUser.password = hash;
        newUser.save((errUser, result) => {
          if (errUser)
            return res.status(400).send({ status: "error", msg: "Register Fail." });
          res
            .status(200)
            .send({ status: "success", msg: "Register Success.", result });
        });
      });
});

module.exports = router;