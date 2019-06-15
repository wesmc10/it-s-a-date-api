const express = require('express');
const JwtAuthService = require('./jwt-auth-service');

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
            .then(dbUser => {
                if (!dbUser) {
                    return res
                        .status(400)
                        .json({
                            error: 'Incorrect username or password'
                        });
                }

                return JwtAuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(passwordsMatch => {
                        if (!passwordsMatch) {
                            return res
                                .status(400)
                                .json({
                                    error: 'Incorrect username or password'
                                });
                        }
                        const sub = dbUser.user_name;
                        const payload = { user_id: dbUser.id };
                        res.send({
                            authToken: JwtAuthService.createJwt(sub, payload)
                        });
                    })
            })
            .catch(next)
    })

jwtAuthRouter
    .route('/signup')

module.exports = jwtAuthRouter;