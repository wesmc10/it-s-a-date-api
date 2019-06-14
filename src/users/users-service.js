const bcrypt = require('bcryptjs');
const xss = require('xss');

const UsersService = {
    validatePassword(password) {
        if (password.length < 8 || password.length > 72) {
            return 'Password must be between 8 and 72 characters in length';
        }

        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces';
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/.test(password)) {
            return 'Password must have at least one lowercase and uppercase letter, number, and special character';
        }
    },
    UserNameAlreadyExists(db, user_name) {
        return db
            .from('itsadate_users')
            .where({ user_name })
            .first()
            .then(user => !!user);
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    insertNewUserIntoDatabase(db, newUser) {
        return db
            .insert(newUser)
            .into('itsadate_users')
            .returning('*')
            .then(([ user ]) => user);
    },
    sanitizeUser(user) {
        return {
            id: user.id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            user_name: xss(user.user_name)
        };
    },
    deleteUser(db, id) {
        return db
            .from('itsadate_users')
            .where({ id })
            .delete()
    }
};

module.exports = UsersService;