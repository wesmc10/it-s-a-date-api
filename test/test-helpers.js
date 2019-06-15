const jwt = require('jsonwebtoken');

function makeTestUsers() {
    return [
        {
            id: 1,
            first_name: 'User-1-first-name',
            last_name: 'User-1-last-name',
            user_name: 'User-1-user-name',
            password: 'User-1-password'
        },
        {
            id: 2,
            first_name: 'User-2-first-name',
            last_name: 'User-2-last-name',
            user_name: 'User-2-user-name',
            password: 'User-2-password'
        },
        {
            id: 3,
            first_name: 'User-3-first-name',
            last_name: 'User-3-last-name',
            user_name: 'User-3-user-name',
            password: 'User-3-password'
        },
        {
            id: 4,
            first_name: 'User-4-first-name',
            last_name: 'User-4-last-name',
            user_name: 'User-4-user-name',
            password: 'User-4-password'
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
    ]
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
            ));
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
    cleanTables,
    makeAuthorizationHeader
};