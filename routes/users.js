const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({
        username
    }, (err, user) => {
        if (err) {
            console.error(err);
            res.send(err);
        }

        user.validatePassword(password).then((isValid) => {
            if (!isValid) {
               res.status(401).json({ message: 'Wrong password' }) 
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
    if (!req.body) {
    return res.status(400).json({message: 'No request body'});
    }

    if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
    }

    let { username, password } = req.body;

    if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
    }

    username = username.trim();

    if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
    }

    if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
    }

    if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
    }

    password = password.trim();

    if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
    }

    return User
    .find({username})
    .count()
    .exec()
    .then(count => {
        if (count > 0) {
            return res.status(422).json({message: 'Username already taken'});
        }

        User.hashPassword(password).then((hash) => {
            const user = new User({
                username,
                password: hash 
            });

            user.save((err, result) => {
                if (err) {
                    console.error(err);
                    res.send('user was not saved correctly');
                }
                console.log(result);
                const token = jwt.sign(result, 'verysecretstring');
                res.send({ 
                    user: result.apiRepr(),
                    token 
                });
            })
        })
    
    });
});

module.exports = router;