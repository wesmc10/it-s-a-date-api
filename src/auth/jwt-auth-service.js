const jwt = require('jsonwebtoken');
const config = require('../config');

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
    }
};

module.exports = JwtAuthService;