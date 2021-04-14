let User = require('../model/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var VerifyToken = require('../VerifyToken');
var config = require('../config');



/////////REGISTER ///////

function register(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: hashedPassword
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        });
}


/////////LOGIN/////////
function login(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.json({auth:false,message:"Email ou mot de passe érroné"});

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.json({ auth: false, token: null,message:"Le mot de passe n'est pas valide"});

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token,role:user.role});
    });

}


// CREATES A NEW USER
function postUser(req, res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
}

// RETURNS ALL THE USERS IN THE DATABASE
function getUsers(req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}

// GETS A SINGLE USER FROM THE DATABASE
function getUser(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
}

// DELETES A USER FROM THE DATABASE
function deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
}

// UPDATES A SINGLE USER IN THE DATABASE
function updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
}


module.exports = { postUser, getUser, getUsers, deleteUser, updateUser, register, login };