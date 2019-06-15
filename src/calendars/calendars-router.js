const express = require('express');
const path = require('path');
const CalendarsService = require('./calendars-service');
const { jwtAuthorization } = require('../middleware/jwt-auth');

const calendarsRouter = express.Router();
const jsonBodyParser = express.json();

calendarsRouter
    .route('/')
    .all(jwtAuthorization)
    .post(jsonBodyParser, (req, res, next) => {
        const { calendar_name } = req.body;
        const newCalendar = { calendar_name };

        if (!calendar_name) {
            return res
                .status(400)
                .json({
                    error: `The 'calendar_name' field is required`
                });
        }

        newCalendar.user_id = req.user.id;

        CalendarsService.insertNewCalendarIntoDatabase(req.app.get('db'), newCalendar)
            .then(calendar => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${calendar.id}`))
                    .json(CalendarsService.sanitizeCalendar(calendar));
            })
            .catch(next);
    })

calendarsRouter
    .route('/:calendar_id')
    .all(jwtAuthorization)
    .all(checkIfCalendarExists)
    .get((req, res) => {
        const user_id = req.user.id;
        const calendar_user_id = res.calendar.user_id;

        if (user_id !== calendar_user_id) {
            return res
                .status(401)
                .json({
                    error: 'Unauthorized request'
                });
        }

        res
            .status(201)
            .json(CalendarsService.sanitizeCalendar(res.calendar));
    })

    async function checkIfCalendarExists(req, res, next) {
        try {
            const calendar = await CalendarsService.getCalendarById(req.app.get('db'), req.params.calendar_id);
            
            if (!calendar) {
                return res
                    .status(404)
                    .json({
                        error: 'Calendar does not exist'
                    });
            }
            res.calendar = calendar;
            next();
        }
        catch(error) {
            next(error);
        }
    }

module.exports = calendarsRouter;