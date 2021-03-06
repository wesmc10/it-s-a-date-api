const app = require('../src/app');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const testHelpers = require('./test-helpers');

describe('Users Endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[1];

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
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.an('object').that.has.property('user');
                        expect(res.body).to.be.an('object').that.has.property('authToken');
                        expect(res.body.user).to.have.property('id');
                        expect(res.body.user.first_name).to.eql(newUser.first_name);
                        expect(res.body.user.last_name).to.eql(newUser.last_name);
                        expect(res.body.user.user_name).to.eql(newUser.user_name);
                        expect(res.body.user).to.not.have.property('password');
                        expect(res.headers.location).to.eql(`/api/users/${res.body.user.id}`);
                    })
                    .expect(res =>
                        db
                            .from('itsadate_users')
                            .where({ id: res.body.user.id })
                            .select('*')
                            .first()
                            .then(user => {
                                expect(user.first_name).to.eql(newUser.first_name);
                                expect(user.last_name).to.eql(newUser.last_name);
                                expect(user.user_name).to.eql(newUser.user_name);

                                return bcrypt.compare(newUser.password, user.password);
                            })
                            .then(passwordsMatch => {
                                expect(passwordsMatch).to.be.true;
                            })
                    )
            });
        });
    });

    describe('DELETE /api/users/:user_id', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('itsadate_users');
            });

            it('responds with a 204 and deletes the user from the database', () => {
                const userId = 2;

                return supertest(app)
                    .delete(`/api/users/${userId}`)
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .expect(204);
            });
        });
    });
});