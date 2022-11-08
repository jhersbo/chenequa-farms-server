# Chenequa Farms Web API #
## Below is a guide on how to use the routes: ##
#### Cross Origin Resource Sharing is enabled and restricted. ####

| URL Route    | Method       | Body        | Explanation     |
|:------------:|:------------:|:-----------|:---------------|
| /user_auth   | `GET`          | NONE        | Gets all users in DB|
| /user_auth/**:user_id** | `GET`   | NONE        | Gets specific user, user's subscriptions, and  user's orders
| /user_auth   | `POST`    |  `user_id: string` `email_address: string` `password_hash: string` `first_name: string` `last_name: string`      | Creates a new user. A unhashed password_hash field will be replaced with a hashed password.
