const app = require('../src/app');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const testHelpers = require('./test-helpers');

describe.only('Users Endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[0];

    before('make db instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean table', () => testHelpers.cleanTables(db));

    afterEach('clean table', () => testHelpers.cleanTables(db));

    describe('POST /api/users', () => {
        context('happy path', () => {
            it('responds with a 201, stores and sanitizes the user, and hashes the password', () => {
                const newUser = {
                    first_name: 'new-user-first-name',
                    last_name: 'new-user-last-name',
                    user_name: 'new-user-user-name',
                    password: 'P@sSw0rD!'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201);
            });
        });
    });
});