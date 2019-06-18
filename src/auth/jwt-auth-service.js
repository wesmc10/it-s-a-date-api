const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

const JwtAuthService = {
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        });
    },
    getUserWithUserName(db, user_name) {
        return db
            .from('itsadate_users')
            .where({ user_name })
            .first();
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        });
    },
    getUserCalendar(db, user_id) {
        return db
            .from('itsadate_calendars')
            .where('user_id', user_id)
            .first();
    },
    getUserEvents(db, calendar_id) {
        return db
            .from('itsadate_events')
            .where('calendar_id', calendar_id);
    }
};

module.exports = JwtAuthService;