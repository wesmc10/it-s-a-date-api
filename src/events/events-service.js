const xss = require('xss');

const EventsService = {
    getEventById(db, id) {
        return db
            .select('*')
            .from('itsadate_events')
            .where('id', id)
            .first();
    },
    sanitizeEvent(event) {
        return {
            event_name: xss(event.event_name),
            description: xss(event.description),
            event_time: event.event_time,
            location: xss(event.location),
            other: xss(event.other)
        };
    },
    insertNewEventIntoDatabase(db, newEvent) {
        return db
            .insert(newEvent)
            .into('itsadate_events')
            .returning('*')
            .then(([ event ]) => event);
    },
    deleteEventFromDatabase(db, id) {
        return db
            .from('itsadate_events')
            .where('id', id)
            .delete();
    },
    updateEvent(db, id, updatedEvent) {
        return db
            .from('itadate_events')
            .where('id', id)
            .update(updatedEvent);
    }
};

module.exports = EventsService;