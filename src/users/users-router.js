const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const JwtAuthService = require('../auth/jwt-auth-service');
const { jwtAuthorization } = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .post(('/'), jsonBodyParser, (req, res, next) => {
        const { first_name, last_name, user_name, password } = req.body;

        for (const field of ['first_name', 'last_name', 'user_name', 'password']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `The '${field}' field is required`
                    });
            }
        }

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res
                .status(400)
                .json({
                    error: passwordError
                });
        }

        UsersService.UserNameAlreadyExists(req.app.get('db'), user_name)
            .then(UserNameAlreadyExists => {
                if (UserNameAlreadyExists) {
                    return res
                        .status(400)
                        .json({
                            error: 'Username already exists'
                        });
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            first_name,
                            last_name,
                            user_name,
                            password: hashedPassword
                        };

                        return UsersService.insertNewUserIntoDatabase(req.app.get('db'), newUser)
                            .then(user => {
                                const sub = user.user_name;
                                const payload = { user_id: user.id };
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .send({
                                        authToken: JwtAuthService.createJwt(sub, payload),
                                        user: UsersService.sanitizeUser(user)
                                    });
                            })
                    })
            })
            .catch(next);
    })

usersRouter
    .route('/:user_id')
    .all(jwtAuthorization)
    .delete((req, res, next) => {
        const { user_id } = req.params;

        UsersService.deleteUser(req.app.get('db'), user_id)
            .then(noContent => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })

module.exports = usersRouter;