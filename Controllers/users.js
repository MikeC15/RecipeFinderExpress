const express = require('express');
const router = express.Router();
const User = require("../Models/users");
const bcrypt = require("bcryptjs");

//Registration post
router.post('/registration', async (req, res) => {
    try {
        const password = req.body.password;
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        const newUser = {};
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = passwordHash;

        const createdUser = await User.create(newUser);
        console.log(`Created User ==>`, createdUser)
        req.session.username = createdUser.username;
        req.session.logged = true;
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.send("Please go back and fill in all required fields.");
    }
})

//Login post
router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username });
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.message = '';
                req.session.username = foundUser.username;
                req.session.logged = true;
                res.redirect('/')
            } else {
                req.session.message = 'Username/password incorrect';
                res.redirect('/');
            }
        } else {
            req.session.message = 'Username/password incorrect';
            res.redirect('/');
        }
    } catch (err) {
        res.send(err);
    }
});

//logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    })
})


module.exports = router;
