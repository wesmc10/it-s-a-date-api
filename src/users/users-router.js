const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

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
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.sanitizeUser(user));
                            })
                    })
            })
            .catch(next);
    })
    .delete(('/:id'), (req, res, next) => {
        const { id } = req.params;

        UsersService.deleteUser(req.app.get('db'), id)
            .then(noContent => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })

module.exports = usersRouter;