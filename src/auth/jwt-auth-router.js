const express = require('express');
const JwtAuthService = require('./jwt-auth-service');
const { jwtAuthorization } = require('../middleware/jwt-auth');

const jwtAuthRouter = express.Router();
const jsonBodyParser = express.json();

jwtAuthRouter
    .route('/login')
    .post(jsonBodyParser, (req, res, next) => {
        const { user_name, password } = req.body;
        const loginUser = { user_name, password };

        for (const [key, value] of Object.entries(loginUser)) {
            if (value === null) {
                return res
                    .status(400)
                    .json({
                        error: `Missing ${key}`
                    });
            }
        }

        JwtAuthService.getUserWithUserName(req.app.get('db'), user_name)
            .then(user => {
                if (!user) {
                    return res
                        .status(400)
                        .json({
                            error: 'Incorrect username or password'
                        });
                }
            })
    })

module.exports = jwtAuthRouter;