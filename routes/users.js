const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    // take data from request body
    const { username, password } = req.body;
    // const user = new User({
    //   username,
    //   password
    // });

    User.findOne({
        username
    }, (err, user) => {
        if (err) {
            console.error(err);
            res.send(err);
        }

        user.validatePassword(password).then((isValid) => {
            if (!isValid) {
               res.status(401).json({ error: 'Wrong password' }) 
            }
             const token = jwt.sign(user, 'verysecretstring');
            console.log(user);
            res.json({
                user: user.apiRepr(),
                token
            });
        })
       
    })

    // user.save((err, result) => {
    //   if (err) {
    //     console.error(err);
    //     res.send('error');
    //   }
    //   console.log(result);
    //   res.send(result);
    // })

    // console.log(req.body);
});

router.post('/signup', (req, res) => {
    // take data from request body
    const { username, password } = req.body;

    User.hashPassword(password).then((hash) => {
        const user = new User({
            username,
            password: hash // use hash to disguise
        });

        user.save((err, result) => {
            if (err) {
                console.error(err);
                res.send('error');
            }
            console.log(result);
            const token = jwt.sign(result, 'verysecretstring');
            res.send({ 
                user: result.apiRepr(),
                token 
            });
        })
    }) 
    

    // console.log(req.body);
});

module.exports = router;