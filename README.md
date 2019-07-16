# It's a Date API

## API Base Endpoint:
* https://enigmatic-brook-16229.herokuapp.com/api

## Login
Returns data about a specific user and the user's calendar and events

* URL

   /auth/login

* Method

   `POST`

* Data Parameters

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 200

   **Content:** `{ authToken: [string], dbCalendar: { object }, dbEvents: [array], dbUser: { object } }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Incorrect username or password }`

   OR

   `{ error: Missing [key] }`

## Users
Returns data about a specific user

* URL

   /users

* Method

   `POST`

* Data Parameters

   `'first_name': [string]`

   `'last_name': [string`

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 201

   **Content:** `{ authToken: [string], user: { object } }`

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

