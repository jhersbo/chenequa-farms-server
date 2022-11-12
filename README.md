# Chenequa Farms Web API #
#### Cross Origin Resource Sharing is enabled and restricted. ####
#### Route Guide: ####
| URL Route    | Method       | Body        | Explanation     |
|:------------:|:------------:|:-----------|:---------------|
| /user_auth   | `GET`          | NONE        | Gets all users in DB|
| /user_auth/**:user_id** | `GET`   | NONE        | Gets specific user, user's subscriptions, and  user's orders
| /user_auth   | `POST`    |  `user_id: string` `email_address: string` `password_hash: string` `first_name: string` `last_name: string` `is_admin: boolean`      | Creates a new user. A unhashed password_hash field will be replaced with a hashed password.     |
| /user_auth/**auth**   | `POST`    | `user_id: string` `password_hash: string`   | Will compare unhashed password with hashed password in DB. Will return status `200` and "User authenticated" message when successful.      |
| /user_auth   | `PUT`     | `user_id: string` `email_address?: string` `password_hash?: string` `first_name?: string` `last_name?: string` `is_admin?: boolean`   |  Queries using `user_id`. Updates item information to the information passed in request body.   |
| /user_auth   | `DELETE`  | `user_id: string`  | Deletes selected user.    |
| /inventory   | `GET`     | NONE         | Gets the entire inventory.    |
| /inventory/**:item_id**   | `GET`   | NONE    | Gets an item by item_id   |
| /inventory   | `POST`     | `item_id: string` `category_id: string` `name: string` `description: string` `number_remaining: integer` `price: decimal` `photo_path: string`   | Creates a new item.     |
| /inventory    | `PUT`     | `item_id: string` `category_id?: string` `name?: string` `description?: string` `number_remaining?: integer` `price?: decimal` `photo_path?: string`   | Querys using `item_id`. Updates item information to the information passed in request body.    |
| /inventory/:**item_id**  | `DELETE`    | NONE    | Deletes selected item.    |
| /user_orders    | `GET`   | NONE    | Gets all orders.    |
| /user_orders/unfilled   | `GET`   | NONE    | Gets all unfilled orders    |
| /user_orders/**:user_id**   | `GET`   | NONE    | Gets `user_id`'s orders.    |
| /user_orders/unfilled/**:user_id**    | `GET`   | NONE    | Gets `user_id`'s unfilled orders.   |
| /user_orders   | `POST`    | `order_id: string` `user_id: string` `order_content: string[]` `filled: boolean -> default: false`    | Creates a new item.   |
| /user_orders    | `PUT`   | `order_id: string` `user_id?: string` `order_content?: string[]` `filled?: boolean`   | Querys using `order_id`. Updates order information to the information passed in request body.    |
| /user_orders/**:order_id**    | `DELETE`    | NONE    | Deletes selected order.   |
| /subscriptions    | `GET`   | NONE    | Gets all subscriptions.   |
| /subscriptions/**:user_id**   | `GET`   | NONE    | Gets a user's subscriptions. Includes user from `user_auth` table.    |
| /subscriptions    | `POST`    | `sub_id: string` `user_id: string` `purch_date: string` `renew_date: string` `active: boolean` `rate: decimal` `type: string`   | Creates a new subscription.   |
| /subscriptions    | `PUT`   | `sub_id: string` `user_id?: string` `purch_date?: string` `renew_date?: string` `active?: boolean` `rate?: decimal` `type?: string`   | Querys using `sub_id`. Updates subscription information to the information passed in request body.    |
| /subscriptions/**:sub_id**   | `DELETE`    | NONE    | Deletes selected subscription.    |
