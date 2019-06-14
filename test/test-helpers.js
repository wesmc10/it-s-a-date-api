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

module.exports = {
    makeTestUsers,
    cleanTables
};