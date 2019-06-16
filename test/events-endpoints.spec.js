const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe('Events Endpoints', () => {
    let db;

    const testUsers = testHelpers.makeTestUsers();
    const testUser = testUsers[0];
    const testCalendars = testHelpers.makeTestCalendars();
    const testCalendar = testCalendars[0];
    const testEvents = testHelpers.makeTestEvents();
    const testEvent = testEvents[0];

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

    describe.only('POST /api/events', () => {
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

            it('responds with 201 and stores and sanitizes the event', () => {
                const newEvent = {
                    event_name: 'new-event-name',
                    description: 'new-event-description',
                    event_time: '18:00',
                    location: 'new-event-location',
                    other: 'new-event-other',
                    day_id: 'new-event-day_id',
                    calendar_id: 1
                };

                return supertest(app)
                    .post('/api/events')
                    .set('Authorization', testHelpers.makeAuthorizationHeader(testUser))
                    .send(newEvent)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.event_name).to.eql(newEvent.event_name);
                        expect(res.body.description).to.eql(newEvent.description);
                        expect(res.body.event_time).to.eql(newEvent.event_time);
                        expect(res.body.location).to.eql(newEvent.location);
                        expect(res.body.other).to.eql(newEvent.other);
                        expect(res.body.day_id).to.eql(newEvent.day_id);
                        expect(res.body.calendar_id).to.eql(newEvent.calendar_id);
                        expect(res.headers.location).to.eql(`/api/events/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                            .select('*')
                            .from('itsadate_events')
                            .where('id', res.body.id)
                            .first()
                            .then(event => {
                                expect(event.id).to.eql(res.body.id);
                                expect(event.event_name).to.eql(newEvent.event_name);
                                expect(event.description).to.eql(newEvent.description);
                                expect(event.event_time).to.eql(newEvent.event_time);
                                expect(event.location).to.eql(newEvent.location);
                                expect(event.other).to.eql(newEvent.other);
                                expect(event.day_id).to.eql(newEvent.day_id);
                                expect(event.calendar_id).to.eql(newEvent.calendar_id);
                            })

                    )
            });
        });
    });

    describe('GET /api/events/:event_id', () => {
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

            beforeEach('insert events into db', () => {
                return db
                    .insert(testEvents)
                    .into('itsadate_events');
            });

            it('responds with 200 and the specified event', () => {
                
            });
        });
    });
});