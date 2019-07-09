BEGIN;

TRUNCATE
    itsadate_events,
    itsadate_calendars,
    itsadate_users
    RESTART IDENTITY CASCADE;

INSERT INTO itsadate_users (first_name, last_name, user_name, password)
VALUES
    ('Wes', 'McElroy', 'wesmcelroy2019', '$2a$12$7Y2Als4/0yL2yYb2hyunvOYgoG02W9jMdQFP/tNNVIJMr0qF2gq8a'), /* !2#4AsDf */
    ('Sarah', 'Darling', 'sarahd05', '$2a$12$hLTmG7CkPDlB6TM8Quu4gOHPoEFVOgyffE/dsAY.KcQP666fB/aU2'),
    ('Skooter', 'Pup', 'skoot&boot', '$2a$12$kH3rdYrwqNThfHUR2DBQ1ObZmQDi0COwUNL9VoswAWUQgj4O7LvD2'),
    ('Laura', 'Wilder', 'doggykittylover', '$2a$12$3wcdnlZWdol4lIhSgmN2rOltMytXZ5gDrdj7g59b5dGO00E8.uijO'),
    ('Al', 'Jeep', 'drivelikethewind', '$2a$12$WGh/LJZlybosWmg14wklq.NwhgsAIS4tV/zd/lu3tfkePl2tAr.4i'),
    ('Corey', 'Stephenson', 'dasfunnyder', '$2a$12$/VSNpQyOWLst54NsR2XSzunypXGBY4ZkglkTBtwg5xBdle4WBrs4.'),
    ('Clay', 'Hey', 'niceguyclay', '$2a$12$HuF2aMesNmVFsZAqhgogTuTPCCaf7bBNgJVVKY4tKaeMk43xThYSu'),
    ('Brandy', 'Onty', 'gonnam@keitB!g', '$2a$12$dQdopeHoX4aDq4CL7/srf.b1RBMA1FAI5JVDWWa1nllt5dq6KyhHe'),
    ('Dace', 'Starkweather', 'daceypoo', '$2a$12$7uPmdEnOxBsE5Ma3ecK0SeXRkLCYeRNUZQrKJ1WTfjauLYiM3T0k6'),
    ('Matters', 'Kribert', 'mattyice', '$2a$12$Yws3azQigHoOo2qbHwlKVun9ihXlNkgyMQy6sS7PA5/I6RByWSYg2');

INSERT INTO itsadate_calendars (calendar_name, user_id)
VALUES
    ('Best Calendar', 1),
    ('Pretty Cally', 2),
    ('Stinky C', 3),
    ('Nice Calendar', 4),
    ('Work Calendar', 5),
    ('Fun Dates', 6),
    ('Parties', 7),
    ('Gaming Events', 8),
    ('Sports Calendar', 9),
    ('Fishing Dates', 10);

INSERT INTO itsadate_events (event_name, description, event_time, location, other, day_id, calendar_id)
VALUES
    ('Lakers game', 'Basketball game', '19:00', 'Staples Center', 'Against Clippers', '06 20 2019', 1),
    ('Music lesson', 'Playing the piano', '15:30', 'Debbie house', 'Thirty minute lesson', '06 01 2019', 2),
    ('Beach walk', 'Walking at Laguna Beach', '10:15', 'Laguna Beach', null, '06 14 2019', 3),
    ('Cleaning house', 'Need to clean every bathroom', '09:00', 'home', 'get cleaner from store', '06 10 2019', 4),
    ('Looking for new car', 'Going to the dealership to check out new cars', '08:30', 'Dealership near the house', null, '06 09 2019', 5),
    ('Brewery', 'Going to the craft brewery with work friends', '20:30', 'The Brewery', 'Pick up Derrick', '06 19 2019', 6),
    ('John birthday party', 'John is turning 30', '19:30', 'Santa Monica Pier', null, '06 15 2019', 7),
    ('Video Games', 'Playing video games with Brandy', '21:45', 'Brandy house', 'Bring all my games', '06 14 2019', 8),
    ('Bears game', 'The Bears are playing the Packers', '12:00', 'Soldier Field', null, '06 27 2019', 9),
    ('Fishing with the boys', 'Going to the big lake to fish for crappy', '07:00', 'Big lake', 'Bring sunscreen', '06 03 2019', 10),
    ('Rangers game', 'Rangers are playing the Angels', '19:05', 'Angels Stadium', null, '06 18 2019', 1),
    ('Work retreat', 'Going to Cape Cod for work retreat', '09:30', 'Meeting at airport', 'Gone for 5 days', '06 13 2019', 5),
    ('Park visit', 'Going to the park down the street with the pretty roses', '18:00', 'Heritage Park', null, '06 06 2019', 2),
    ('Gun range', 'Going to the gun range with Jim and John', '17:30', 'Jimmy John Gun Range', null, '07 10 2019', 6),
    ('Palm Springs', 'Going to Palm Springs to relax for a few days', '14:00', 'Palm Springs, CA', null, '06 18 2019', 1);

COMMIT;