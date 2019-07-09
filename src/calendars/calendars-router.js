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
        const { calendar_name, user_id } = req.body;
        const newCalendar = { calendar_name, user_id };

        for (const field of ['calendar_name', 'user_id']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `The '${field}' field is required`
                    });
            }
        }

        CalendarsService.insertNewCalendarIntoDatabase(req.app.get('db'), newCalendar)
            .then(calendar => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${calendar.id}`))
                    .send({
                        calendar: CalendarsService.sanitizeCalendar(calendar)
                    });
            })
            .catch(next);
    })

calendarsRouter
    .route('/:calendar_id')
    .all(jwtAuthorization)
    .all(checkIfCalendarExists)
    .get((req, res) => {
        res
            .status(200)
            .json(CalendarsService.sanitizeCalendar(res.calendar));
    })
    .delete((req, res, next) => {
        const { calendar_id } = req.params;

        CalendarsService.deleteCalendarFromDatabase(req.app.get('db'), calendar_id)
            .then(noContent => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { calendar_id } = req.params;
        const { calendar_name } = req.body;
        const calendarToUpdate = { calendar_name };

        const numberOfValuesUpdated = Object.values(calendarToUpdate).filter(Boolean).length;
        if (numberOfValuesUpdated === 0) {
            return res
                .status(400)
                .json({
                    error: 'Request body must contain a calendar name'
                });
        }

        CalendarsService.updateCalendar(req.app.get('db'), calendar_id, calendarToUpdate)
            .then(noContent => {

                return CalendarsService.getCalendarById(req.app.get('db'), calendar_id)
                    .then(calendar => {
                        res
                            .status(200)
                            .send({
                                calendar: CalendarsService.sanitizeCalendar(calendar)
                            });
                    })
            })
            .catch(next);
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