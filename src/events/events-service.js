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
            id: event.id,
            event_name: xss(event.event_name),
            description: xss(event.description),
            event_time: event.event_time,
            location: xss(event.location),
            other: xss(event.other),
            day_id: xss(event.day_id),
            calendar_id: event.calendar_id
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