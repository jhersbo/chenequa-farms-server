# Chenequa Farms Web API #
## Below is a guide on how to use the routes: ##
#### Cross Origin Resource Sharing is enabled and restricted. ####

| URL Route    | Method       | Body        | Explanation     |
|:------------:|:------------:|:-----------|:---------------|
| /user_auth   | `GET`          | NONE        | Gets all users in DB|
| /user_auth/**:user_id** | `GET`   | NONE        | Gets specific user, user's subscriptions, and  user's orders
| /user_auth   | `POST`    |  `user_id: string` `email_address: string` `password_hash: string` `first_name: string` `last_name: string`      | Creates a new user. A unhashed password_hash field will be replaced with a hashed password.     |
| /user_auth/**auth**   | `POST`    | `user_id: string` `password_hash: string`   | Will compare unhashed password with hashed password in DB. Will return status `200` and "User authenticated" message when successful.      |
| /user_auth   | `PUT`     | `user_id: string` `email_address: string` `password_hash: string` `first_name: string` `last_name: string`    |  Updates user information to the information passed in request body.   |
| /user_auth   | `DELETE`  | `user_id: string`  | Deletes selected user.    |
