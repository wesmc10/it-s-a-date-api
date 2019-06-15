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
    }
};

module.exports = JwtAuthService;