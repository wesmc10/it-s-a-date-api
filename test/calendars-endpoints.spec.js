const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe('Calendars Endpoints', () => {
    let db;

    const testCalendars = testHelpers.makeTestCalendars();
    const testCalendar = testCalendars[0];
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

    describe('POST /api/calendars', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('itsadate_users');
            });

            it('responds with 201 and stores and sanitizes the calendar', () => {
                const newCalendar = {
                    calendar_name: 'new-calendar-name',
                    user_id: 1
                };

                return supertest(app)
                    .post('/api/calendars')
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .send(newCalendar)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.an('object');
                        expect(res.body.calendar).to.have.property('id');
                        expect(res.body.calendar.calendar_name).to.eql(newCalendar.calendar_name);
                        expect(res.body.calendar.user_id).to.eql(newCalendar.user_id);
                        expect(res.headers.location).to.eql(`/api/calendars/${res.body.calendar.id}`);
                    })
                    .expect(res =>
                        db
                            .select('*')
                            .from('itsadate_calendars')
                            .where('id', res.body.calendar.id)
                            .first()
                            .then(calendar => {
                                expect(calendar.id).to.eql(res.body.calendar.id);
                                expect(calendar.calendar_name).to.eql(newCalendar.calendar_name);
                                expect(calendar.user_id).to.eql(newCalendar.user_id);
                            })
                    )   
            });
        });
    });

    describe('GET /api/calendars/:calendar_id', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('itsadate_users');
            });

            beforeEach('insert calendars into db', () => {
                return db
                    .insert(testCalendars)
                    .into('itsadate_calendars');
            });

            it('responds with 200 and the specified calendar', () => {
                const calendarId = 1;
                const selectedCalendar = testCalendar;

                return supertest(app)
                    .get(`/api/calendars/${calendarId}`)
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .expect(200, selectedCalendar);
            });
        });
    });

    describe('DELETE /api/calendars/:calendar_id', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('itsadate_users');
            });

            beforeEach('insert calendars into db', () => {
                return db
                    .insert(testCalendars)
                    .into('itsadate_calendars');
            });

            it('responds with 204 and deletes the specified calendar', () => {
                const calendarId = 1;

                return supertest(app)
                    .delete(`/api/calendars/${calendarId}`)
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/calendars/${calendarId}`)
                            .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                            .expect(404)
                    )
            });
        });
    });

    describe('PATCH /api/calendars/:calendar_id', () => {
        context('happy path', () => {
            beforeEach('insert users into db', () => {
                return db
                    .insert(testUsers)
                    .into('itsadate_users');
            });

            beforeEach('insert calendars into db', () => {
                return db
                    .insert(testCalendars)
                    .into('itsadate_calendars');
            });

            it('responds with 204 and updates the specified calendar', () => {
                const calendarId = 1;
                const updateCalendar = {
                    calendar_name: 'updated-calendar-name'
                };
                const expectedCalendar = {
                    ...testCalendars[calendarId - 1],
                    ...updateCalendar
                };

                return supertest(app)
                    .patch(`/api/calendars/${calendarId}`)
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .send(updateCalendar)
                    .expect(200)
                    .then(res =>
                        supertest(app)
                            .get(`/api/calendars/${calendarId}`)
                            .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                            .expect(200, expectedCalendar)    
                    )
            });
        });
    });
});