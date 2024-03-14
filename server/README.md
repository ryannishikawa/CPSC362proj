# Database Endpoints
Currently, these endpoints access and/or store various data to the server.
All endpoints are accessed at `/api/`



## Users
This endpoint category manages users within the database.

### Add
Add a user to the database.\
**POST**: `/api/users/add`

<u>**Request Body**</u>\
`name`: The first and last name for this new user.\
`email`: The email address for this new user.\
`pass`: The password for this account.


### Find
Find a user in the database given email and password.

**POST**: `/api/users/find`

<u>**Request Body**</u>\
`email`: The email for this user.\
`pass`: The password for this user.

<u>**Response Body**</u>\
`name`: The name of the user\
`user_key`: The user key for this user for encryption purposes\
`uid`: A unique integer representing the user





## Task
This endpoint category manages tasks of a user.

### Add
Add a task given a user. If the user doesn't exist within the database, adds them.

<u>**Request Body**</u>\
`uid`: The unique ID of the user\
`description`: The description of the given task

### Find
Returns an array of tasks associated with a user

<u>**Request Body**</u>\
`uid`: The unique ID of the user

<u>**Response Body**</u>\
`array[task{tid, description, completed}]`: An array of task objects

### Remove (WIP)
Remove a task given a user.

### Update (WIP)
Update a task given a user.
