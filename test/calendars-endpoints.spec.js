const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe.only('Calendars Endpoints', () => {
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
                        expect(res.body).to.have.property('id');
                        expect(res.body.calendar_name).to.eql(newCalendar.calendar_name);
                        expect(res.body.user_id).to.eql(newCalendar.user_id);
                        expect(res.headers.location).to.eql(`/api/calendars/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                            .select('*')
                            .from('itsadate_calendars')
                            .where('id', res.body.id)
                            .first()
                            .then(calendar => {
                                expect(calendar.id).to.eql(res.body.id);
                                expect(calendar.calendar_name).to.eql(newCalendar.calendar_name);
                                expect(calendar.user_id).to.eql(newCalendar.user_id);
                            })
                    )   
            });
        });
    });
});