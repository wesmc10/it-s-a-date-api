const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function makeTestUsers() {
    return [
        {
            id: 1,
            first_name: 'User-1-first-name',
            last_name: 'User-1-last-name',
            user_name: 'User-1-user-name',
            password: '!2#4AsDf'
        },
        {
            id: 2,
            first_name: 'User-2-first-name',
            last_name: 'User-2-last-name',
            user_name: 'User-2-user-name',
            password: '$9*7PoIu'
        },
        {
            id: 3,
            first_name: 'User-3-first-name',
            last_name: 'User-3-last-name',
            user_name: 'User-3-user-name',
            password: '%6&8JhGf'
        },
        {
            id: 4,
            first_name: 'User-4-first-name',
            last_name: 'User-4-last-name',
            user_name: 'User-4-user-name',
            password: '#7%8BgMj'
        }
    ];
}

function makeTestCalendars() {
    return [
        {
            id: 1,
            calendar_name: 'test-calendar-1',
            user_id: 4
        },
        {
            id: 2,
            calendar_name: 'test-calendar-2',
            user_id: 3
        },
        {
            id: 3,
            calendar_name: 'test-calendar-3',
            user_id: 2
        },
        {
            id: 4,
            calendar_name: 'test-calendar-4',
            user_id: 1
        }
    ];
}

function makeTestEvents() {
    return [
        {
            id: 1,
            event_name: 'test-event-1',
            description: 'test-event-1-description',
            event_time: '10:00',
            location: 'test-event-1-location',
            other: 'test-event-1-other',
            day_id: 'test-event-1-day_id',
            calendar_id: 4
        },
        {
            id: 2,
            event_name: 'test-event-2',
            description: 'test-event-2-description',
            event_time: '12:00',
            location: 'test-event-2-location',
            other: 'test-event-2-other',
            day_id: 'test-event-2-day_id',
            calendar_id: 3
        },
        {
            id: 3,
            event_name: 'test-event-3',
            description: 'test-event-3-description',
            event_time: '14:00',
            location: 'test-event-3-location',
            other: 'test-event-3-other',
            day_id: 'test-event-3-day_id',
            calendar_id: 2
        },
        {
            id: 4,
            event_name: 'test-event-4',
            description: 'test-event-4-description',
            event_time: '16:00',
            location: 'test-event-4-location',
            other: 'test-event-4-other',
            day_id: 'test-event-4-day_id',
            calendar_id: 1
        }
    ];
}

function cleanTables(db) {
    return db
        .transaction(trx =>
            trx.raw(
                `TRUNCATE
                    itsadate_events,
                    itsadate_calendars,
                    itsadate_users
                `    
            )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE itsadate_events_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE itsadate_calendars_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE itsadate_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('itsadate_events_id_seq', 0)`),
                    trx.raw(`SELECT setval('itsadate_calendars_id_seq', 0)`),
                    trx.raw(`SELECT setval('itsadate_users_id_seq', 0)`)
                ])
            )
        )
}

function seedUsers(db, users) {
    const hashedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db
        .insert(hashedUsers)
        .into('itsadate_users')
        .then(() =>
            db.raw(
                `SELECT setval('itsadate_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
  }

function makeAuthorizationHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256'
    });
    return `Bearer ${token}`;
}

module.exports = {
    makeTestUsers,
    makeTestCalendars,
    makeTestEvents,
    cleanTables,
    seedUsers,
    makeAuthorizationHeader
};