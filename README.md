# It's a Date API

## API Base Endpoint:
* https://enigmatic-brook-16229.herokuapp.com/api


## Login
Returns data about a specific user and the user's calendar and events

* Route

   /auth/login

* Method

   `POST`

* Data Parameters

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 200

   **Content:** `{ authToken: [string], dbCalendar: [object], dbEvents: [array], dbUser: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Incorrect username or password }`

   OR

   `{ error: Missing [key] }`


## Users
Posts and returns data about a specific user

* Route

   /users

* Method

   `POST`

* Data Parameters

   `'first_name': [string]`

   `'last_name': [string]`

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 201

   **Content:** `{ authToken: [string], user: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: The [key] field is required }`

   OR

   `{ error: Username already exists }`

   OR

   `{ Password must be between 8 and 72 characters in length }`

   OR

   `{ Password must not start or end with empty spaces }`

   OR

   `{ Password must have at least one lowercase and uppercase letter, number, and special character }`


## POST Calendars
Posts and returns data about a specific calendar

* Route

   /calendars

* Method

   `POST`

* Data Parameters

   `'calendar_name': [string]`

   `'user_id': [integer]`

* Successful Response

   **Code:** 201

   **Content:** `{ calendar: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: The [key] field is required }`


## GET Calendars
Returns data about a specific calendar

* Route

   /calendars/:calendar_id

* Method

   `GET`

* Data Parameters

   None

* Successful Response

   **Code:** 200

   **Content:** `{ calendar: [object] }`

* Error Response

   **Code:** 404

   **Content:** `{ error: Calendar does not exist }`


## DELETE Calendars
Deletes a specific calendar

* Method

   `DELETE`

* Data Parameters

   None

* Successful Response

   **Code:** 204

   **Content:** None

* Error Response

   **Code:** 404

   **Content:** `{ error: Calendar does not exist }`


## PATCH Calendars
Updates and returns data about a specific calendar

* Method

   `PATCH`

* Data Parameters

   `'calendar_name': [string]`

* Successful Response

   **Code:** 200

   **Content:** `{ calendar: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Calendar does not exist }`

   OR

   `{ error: Request body must contain a calendar name }`


## POST Events
Posts and returns data about specific user events

* Route

   /events

* Method

   `POST`

* Data Parameters

   `'event_name': [string]`

   `'description': [string]`

   `'event_time': [time]`

   `'location': [string]`
   
   `'other': [string]`

   `'day_id': [integer]`

   `'calendar_id': [integer]`

* Successful Response

   **Code:** 201

   **Content:** `{ event: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: The [key] field is required }`


## GET Events
Returns data about a specific user event

* Route

   /events/:event_id

* Method

   `GET`

* Data Parameters

   None

* Successful Response

   **Code:** 200

   **Content:** `{ event: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Event does not exist }`


## DELETE Events
Deletes a specific user event

* Route

   /events/:event_id

* Method

   `DELETE`

* Data Parameters

   None

* Successful Response

   **Code:** 204

   **Content:** None

* Error Response

   **Code:** 400

   **Content:** `{ error: Event does not exist }`


## PATCH Events
Updates and returns data about a specific user event

* Route

   /events/:event_id

* Method

   `PATCH`

* Data Parameters

    **At least one of:**

   `'event_name': [string]`

   `'description': [string]`

   `'event_time': [time]`

   `'location': [string]`
   
   `'other': [string]`

* Successful Response

   **Code:** 200

   **Content:** `{ event: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Event does not exist }`

   OR

   `{ error: Request body must contain either an event name, description, time, location, or other }`