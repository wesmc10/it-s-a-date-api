const xss = require('xss');

const CalendarsService = {
    getCalendarById(db, id) {
        return db
            .select('*')
            .from('itsadate_calendars')
            .where('id', id)
            .first();
    },
    insertNewCalendarIntoDatabase(db, newCalendar) {
        return db
            .insert(newCalendar)
            .into('itsadate_calendars')
            .returning('*')
            .then(([ calendar ]) => calendar);
    },
    sanitizeCalendar(calendar) {
        return {
            id: calendar.id,
            calendar_name: xss(calendar.calendar_name),
            user_id: calendar.user_id
        };
    },
    deleteCalendarFromDatabase(db, id) {
        return db
            .from('itsadate_calendars')
            .where({ id })
            .delete();
    },
    updateCalendar(db, id, updatedCalendar) {
        return db
            .from('itsadate_calendars')
            .where({ id })
            .update(updatedCalendar);
    }
}

module.exports = CalendarsService;