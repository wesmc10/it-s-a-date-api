const express = require('express');
const path = require('path');
const EventsService = require('../events/events-service');
const { jwtAuthorization } = require('../middleware/jwt-auth');

const eventsRouter = express.Router();
const jsonBodyParser = express.json();

eventsRouter
    .route('/')
    .all(jwtAuthorization)
    .post(jsonBodyParser, (req, res, next) => {
        const { event_name, description, event_time, location, other, day_id, calendar_id } = req.body;
        const newEvent = {
            event_name,
            description,
            event_time,
            location,
            other,
            day_id,
            calendar_id
        };
        
        for (const field of ['event_name', 'description', 'event_time', 'location', 'day_id', 'calendar_id']) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .json({
                        error: `The '${field}' field is required`
                    });
            }
        }

        EventsService.insertNewEventIntoDatabase(req.app.get('db'), newEvent)
            .then(event => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${event.id}`))
                    .send({
                        event: EventsService.sanitizeEvent(event)
                    });
            })
            .catch(next);
    })

eventsRouter
    .route('/:event_id')
    .all(jwtAuthorization)
    .all(checkIfEventExists)
    .get((req, res) => {
        res
            .status(200)
            .json(EventsService.sanitizeEvent(res.event));
    })
    .delete((req, res, next) => {
        const { event_id } = req.params;

        EventsService.deleteEventFromDatabase(req.app.get('db'), event_id)
            .then(noContent => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { event_id } = req.params;
        const { event_name, description, event_time, location, other } = req.body;
        const eventToUpdate = {
            event_name,
            description,
            event_time,
            location,
            other
        };

        const numberOfValuesToUpdate = Object.values(eventToUpdate).filter(Boolean).length;
        if (numberOfValuesToUpdate === 0) {
            return res
                .status(400)
                .json({
                    error: 'Request body must contain either an event name, description, time, location, or other'
                });
        }

        EventsService.updateEvent(req.app.get('db'), event_id, eventToUpdate)
            .then(noContent => {
                res
                    .status(204)
                    .end();
            })
            .catch(next);
    })

    async function checkIfEventExists(req, res, next) {
        try {
            const event = await EventsService.getEventById(req.app.get('db'), req.params.event_id);
            
            if (!event) {
                return res
                    .status(404)
                    .json({
                        error: 'Event does not exist'
                    });
            }
            res.event = event;
            next();
        }
        catch(error) {
            next(error);
        }
    }

module.exports = eventsRouter;