const mongoose = require("mongoose");

const express = require('express');
let router = express.Router();

router.get("/", getUsers);
router.post('/', express.json(), addUser);
router.get("/:userID", getUser);
router.put('/:userID', express.json(), editUser);

//returns json of users in db or users page
function getUsers(req, res, next){
    let name = ''
    if(req.query.name){
        name = req.query.name;
    }

    mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const User = require('../UserModel');
        User.find({username: {$regex: name, $options: 'i'}}, function(err, result){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            mongoose.connection.close();
            res.format({
                "application/json": () => {res.status(200).send(JSON.stringify(result));},
                "text/html": () => {res.render('../views/pages/users', {
                    loggedin: req.session.loggedin, 
                    admin: req.session.admin, 
                    id: req.session.user,
                    users: result
                })}
            });
        });
    });
}

//adds user to db
function addUser(req, res, next){
    mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const User = require('../UserModel');
        User.findOne({username: req.body.username}, function(err, result){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            if(result !== null){
                mongoose.connection.close();
                res.status(418).send()
            }
            else{
                let user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    privacy: false
                });

                user.save(function (err, data){
                    if(err){
                        mongoose.connection.close();
                        res.status(500).send('server error');
                        return;
                    }
                    mongoose.connection.close();
                    res.status(201).send(data);
                });
            }
        });
    });
}

//returns json of single user or profile page
function getUser(req, res, next){
    let id = req.params.userID;

    mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const User = require('../UserModel');
        User.findOne({_id: id}, function(err, result){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            mongoose.connection.close();

            //viewing someones private page
            if(result.privacy === true && req.session.user != result._id){
                res.status(403).send('unauthorized request');
                return;
            }

            //viewing own page
            if(result._id == req.session.user){
                res.format({
                    "application/json": () => {res.status(200).send(JSON.stringify(result));},
                    "text/html": () => {
                        res.render('../views/pages/profile', {
                            loggedin: req.session.loggedin, 
                            admin: req.session.admin, 
                            id: req.session.user,
                            user: result,
                            selfpage: true
                        });
                    }
                });
            }

            //viewing public page
            else{
                res.render('../views/pages/profile', {
                    loggedin: req.session.loggedin, 
                    admin: req.session.admin, 
                    id: req.session.user,
                    user: result,
                    selfpage: false
                });
            }
        });
    });
}

//changes a user's information in db
function editUser(req, res, next){
    mongoose.connect("mongodb://localhost:27017/a4", {useNewUrlParser:true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        const User = require('../UserModel');
        User.findOneAndUpdate({_id: req.params.userID}, req.body, {upsert: false}, function(err, result){
            if(err){
                mongoose.connection.close();
                res.status(500).send('server error');
                return;
            }
            mongoose.connection.close();
            res.status(201).send();
        });
    });
}

//Export the router so it can be mounted in the main app
module.exports = router;