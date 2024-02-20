# Database Endpoints
Currently, these endpoints access and/or store various data to the server.
All endpoints are accessed at `/api/`



## Users
This endpoint category manages users within the database.

### Add
Add a user to the database.\
**POST**: `/api/users/add`

**Parameters**\
`name`: The first and last name for this new user.\
`email`: The email address for this new user.\
`pass`: The password for this account.\


### Find
Find a user in the database given email and password.

**POST**: `/api/users/find`

**Parameters**\
`email`: The email for this user.\
`pass`: The password for this user.\



## Task (WIP!)
This endpoint category manages tasks of a user.\

### Add
Add a task given a user.

### Remove
Remove a task given a user.

### Update
Update a task given a user.