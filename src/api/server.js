"use strict";


var router = require('express').Router();
var passport = require('passport');
var user = require('./user');
var bodyParser = require('body-parser');
var expressApp = require('express')();
var db = require('./db');
var config = require('./config');

//====================================================
// Passport Setting

{
    let authHandler;
    let BasicStrategy = require('passport-http').BasicStrategy;

    passport.use(new BasicStrategy(
        (username, password, done) => {
            authHandler(username, password, done);
        }
    ));

    // Authentication
    authHandler = (email, password, done) => {
        user.isValid({email: email, password: password})
            .then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            });
    };
}


//====================================================
// Router

{
    let authMiddleware = passport.authenticate('basic', {session: false});

    // Utility Functions
    let response = (callback) => {
        return (request, response) => {
            var ok = (json) => {
                response.type('json').status(200).json(json);
            };
            var error = (json, code) => {
                response.type('json').status(code || 500).json(json);
            };
            callback(ok, error);
        }
    };

    // Root
    router.get('/', response((ok) => {
        ok({});
    }));

    // Create the new user
    /*
    router.post('/users', function (req, res) {
        var body = req.body,
            user = new User({
                "email": body['email'],
                "display-name": body['display-name'],
                "password": body['password']
            });

        user.save(function (err, newUser) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));

            sendJson(res, 200, newUser);

            if (!global.SC4.isTest) {
                newUser.sendPassword();
            }
        });
    });
     */

}


/*



mkErrMsgFromErrObj = function (error) {
    return {
        errorMessages: _.mapValues(error.errors, function (_error) {
            return _error.message;
        })
    };
};

mkErrMsg = function (message) {
    return {
        errorMessages: [message]
    };
};

mkMsg = function (message) {
    return {
        message: message
    };
};



// Create the new user
router.post('/new-user', function (req, res) {
    var body = req.body,
        user = new User({
            "email": body['email'],
            "display-name": body['display-name'],
            "password": User.createPassword()
        });

    user.save(function (err, newUser) {
        if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));

        sendJson(res, 200, newUser);

        if (!global.SC4.isTest) {
            newUser.sendPassword();
        }
    });
});

// Send the password to the email address.
router.post('/send-email', function (req, res) {
    var email = req.body['email'];

    User.where("email").equals(email)
        .findOne()
        .exec(function (err, user) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            if (!user) return sendJson(res, 400, mkErrMsg("The email address has not been registered."));

            user.sendPassword()
                .then(function () {
                    sendJson(res, 200, {});
                })
                .fail(function () {
                    sendJson(res, 400, mkErrMsg("We couldn't send an email to the email address. Please check your email address and try again later."));
                });
        });
});

// Get the user's info
router.get('/user', auth.authMiddleware, function (req, res) {
    sendJson(res, 200, req.user);
});

// Get the user's password (for testing)
if (global.SC4.isTest) {
    router.get('/user-password/:id', function (req, res) {
        var userId = req.params.id;

        User.findById(userId, function (err, user) {
            user.save(function (err) {
                if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
                sendJson(res, 200, {'password': user.password});
            });
        });
    });
}

// Update the user's information
router.post('/user', auth.authMiddleware, function (req, res) {
    var displayName = req.body['display-name'],
        userId = req.user._id;

    User.findById(userId, function (err, user) {
        if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));

        if (displayName) {
            user["display-name"] = displayName;
        }

        user.save(function (err) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            sendJson(res, 200, user);
        });
    });
});

// Get all piece types
router.get('/piece-types', auth.authMiddleware, function (req, res) {
    PieceType
        .find()
        .exec(function (err, pieceTypes) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            sendJson(res, 200, pieceTypes);
        });
});

// Get available games
router.get('/games', auth.authMiddleware, function (req, res) {
    Game
        .where("playerId1").ne(null)
        .where("playerId2").equals(null)
        .exec(function (err, games) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            sendJson(res, 200, games);
        });
});

// Create a new game
router.post('/games', auth.authMiddleware, function (req, res) {
    var pieceType = req.body['piece-type-id'],
        userId = req.user._id;

    if (!pieceType)
        return sendJson(res, 400, mkErrMsg("The ID of your piece type is needed to create a new game."));

    Game.where("playerId1").equals(userId)
        .count()
        .exec(function (err, count) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            if (count >= 1) return sendJson(res, 400, mkErrMsg("You have already created another game."));

            var game = new Game({
                playerId1: userId,
                pieceTypeId1: pieceType
            });

            game.save(function (err) {
                if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
                sendJson(res, 200, game);
            });
        });
});

// Get the game
router.get('/games/:id', auth.authMiddleware, function (req, res) {
    var gameId = req.params.id;

    if (!gameId)
        return sendJson(res, 400, mkErrMsg("The game ID doesn't exist."));

    Game.findById(gameId, function (err, game) {
        if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
        sendJson(res, 200, game);
    });
});

// Join the game
router.post('/games/:id', auth.authMiddleware, function (req, res) {
    var gameId = req.params.id,
        userId = req.user._id,
        pieceTypeId = req.body['piece-type-id'];

    if (!gameId)
        return sendJson(res, 400, mkErrMsg("The game ID doesn't exist."));

    if (!pieceTypeId)
        return sendJson(res, 400, mkErrMsg("The piece type ID doesn't exist."));

    Game.findById(gameId, function (err, game) {
        if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));

        if (game.isPlayer1(userId))
            return sendJson(res, 400, mkErrMsg("The game should have been joined by the first player."));

        if (game.isPieceTypeOfPlayer1(pieceTypeId))
            return sendJson(res, 400, mkErrMsg("You can't select the same piece type that the first player has taken."));

        game.playerId2 = userId;
        game.pieceTypeId2 = pieceTypeId;

        game.save(function (err) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            sendJson(res, 200, game);
        });
    });
});

// Make a new move
router.post('/games/:id/moves', auth.authMiddleware, function (req, res) {
    var gameId = req.params.id,
        userId = req.user._id,
        move = req.body['move'];

    if (!gameId)
        return sendJson(res, 400, mkErrMsg("The game ID doesn't exist."));

    move = parseInt(move);

    if (isNaN(move))
        return sendJson(res, 400, mkErrMsg("The value for the move should be an integer."));

    Game.findById(gameId, function (err, game) {
        if (err)
            return sendJson(res, 400, mkErrMsgFromErrObj(err));

        if (!game.isPlayer(userId))
            return sendJson(res, 400, mkErrMsg("You're can't send a move for the game you don't belong to"));

        if (!game.hasStarted())
            return sendJson(res, 400, mkErrMsg("The game hasn't started yet."));

        if (game.isOver())
            return sendJson(res, 400, mkErrMsg("The game has already been over."));

        if (!game.isTheirTurn(userId))
            return sendJson(res, 400, mkErrMsg("It's not your turn."));

        if (!game.isValidMove(move))
            return sendJson(res, 400, mkErrMsg("It's not a valid move."));

        if (!game.isAvailableMove(move))
            return sendJson(res, 400, mkErrMsg("It's not an available move."));

        game.moves.push(move);

        game.save(function (err) {
            if (err) return sendJson(res, 400, mkErrMsgFromErrObj(err));
            sendJson(res, 200, game);
        });
    });
});
 */



//====================================================
// Express settings




//====================================================
// Exports

{
    let server;

    /**
     * @returns {Promise}
     */
    let start = () => new Promise((resolve, reject) => {
        var settings = config.load();
        db.connect()
            .then(() => {
                server = expressApp.listen(settings.web_server_port, settings.web_server_host,
                    (err) => {
                        !err ? resolve() : reject(err);
                    });
            });
    });

    /**
     * @returns {Promise}
     */
    let stop = () => new Promise((resolve, reject) => {
        if (server) {
            server.close((err) => {
                if (!err) {
                    db.disconnect()
                        .then(resolve)
                        .catch(reject);
                }
            });
        }
    });

    expressApp.use(bodyParser.json());
    expressApp.use(passport.initialize());
    expressApp.use('/', router);

    module.exports = {
        start,
        stop
    };
}