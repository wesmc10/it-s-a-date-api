const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Authorization Endpoint', () => {
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

    before('clean tables', () => testHelpers.cleanTables(db));

    afterEach('clean tables', () => testHelpers.cleanTables(db));

    describe('POST /api/auth/login', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () =>
                testHelpers.seedUsers(db, testUsers)
            );

            it('responds with 200, logs in, and creates the jwt', () => {
                const userValidAuthorization = {
                    user_name: testUser.user_name,
                    password: testUser.password
                };
                const payload = { user_id: testUser.id };
                const subject = testUser.user_name;
                const expectedJwt = jwt.sign(payload, process.env.JWT_SECRET, {
                    subject,
                    algorithm: 'HS256'
                });

                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidAuthorization)
                    .expect(200, {
                        authToken: expectedJwt
                    });
            });
        });
    });
});