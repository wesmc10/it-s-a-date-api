# It's a Date API

## API Base Endpoint:
* https://enigmatic-brook-16229.herokuapp.com/api

## Login
Returns data about a specific user

* URL

   /auth/login

* Method

   `POST`

* Data Parameters

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 200

* Error Response

   **Code:** 400
   **Content:** `{ error: Incorrect username or password }`

   OR

   `{ error: Missing [key] }`