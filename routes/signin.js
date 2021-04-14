const express = require('express');
const User = require('../models/User');
const UserSession = require('../models/UserSession')
const bcrypt = require('bcrypt');
const router = express.Router();
const app = require('express')();

router.post('/signup', (req, res, next) => {
    const { body } = req;
    const {
        username,
        email,
        password
    } = body;

    if (!username) {
        return res.send({
            success: false,
            message: 'Enter your username.'
        });
    }

    if (!email) {
        return res.send({
            success: false,
            message: 'Please Enter a Valid Email Address.'
        });
    }

    if (!password) {
        return res.send({
            success: false,
            message: 'Please Enter a Valid Password'
        });
    }
    //email = email.toLowerCase();

    User.find({ email: email.toLowerCase()},   
        (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'There is an error.'
                });
            }   else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Account already exists.'
                });    
            }
        
            const newUser = new User();
            newUser.userName = username;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Sorry, Unable to Sign Up.'   
                    });        
                }
                return res.send({
                    success: true,
                    message: 'Welcome Aboard- Signed Up.'
                });
            });
    });
});

router.post('/signin', (req, res, next) => {
    const { body } = req;
    let {
        email,
        password
    } = body;

    if (!email || typeof email != "string") {
        return res.send({
            success: false,
            message: 'Please Enter a Valid Email Address.'
        });
    }
    if (!password || typeof password != "string") {
        return res.send({
            success: false,
            message: 'Enter Password to the Field.'
        });
    }

    email = email.toLowerCase();

    User.find({
        email: email
    },  (err, users) => 
    {
        if (err) {
            return res.send({
                success: false,
                message: 'Server Error.'                    
            });
        }
    
        if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Invalid Entry.'
            });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'UserName or passsword do not match'
            });
        }

        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error'
                });
            }

            return res.send({
                success: true,
                message: 'Signed in!',
                token: doc._id
            });
        });
    });
});



router.get('/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find({
        _id: token,
        isDeleted: false
    },  (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Verification Error.'
            });
        }
        if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'No session Found'
            })
        }
        
        return res.send({
            success: true,
            message: 'Verified'
        });
        
    });
});

router.post('/makemove', (req, res, next) => {
    let chessboard = ["hi"]
    return res.send({
        success: true,
        board: chessboard
    })
});

router.get('/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set:{
            isDeleted:true
        }
    },  null, (err, sessions) => {  
    if (err) {
        console.log(err);
        return res.send({
            success: false,
            message: 'Logout Error.'
        });
    }
    return res.send({
                success: true,
                message: 'Good, Glad You Were Here.'
            });
    });
});



module.exports = router;