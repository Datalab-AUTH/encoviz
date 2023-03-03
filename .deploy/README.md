## Steps to start dev environment

- _Optional_: You can change any configured environment value on the `docker-compose.yml` file according to your personal preference
- Run the command `docker-compose up --build` in the `.deploy` folder
  > After running this command you will have up and running keycloak's container with postgres db.

When the users have been created on keycloak you need to enter to `greendashboard.api` container and run the command `python3 import_hardware.py` to seed the mongoDB with the hardware list.

Then, you can access the API using the following URL: http://localhost:8000

<br>

## Steps to map Keycloak's Users with MongoDb users

1. Get valid access token:
   - **Post** request to: http://localhost:8080/realms/GreenDash/protocol/openid-connect/token with body
   ```
   {
    username: "identityadmin",
    password: "admin",
    grant_type: "password",
    client_id: "admin-cli"
   }
   ```
   - Add as header:
   ```
   {  Content-Type: application/x-www-form-urlencoded }
   ```
   - you will get a response in the form of:
   ```
   {
     "access_token": "eyJhbGciOiJSUz...", // just an example
     "expires_in": ,
     "refresh_expires_in": ,
     "refresh_token": "",
     "token_type": "Bearer",
     "not-before-policy": ,
     "session_state": "",
     "scope": "email profile"
   }
   ```
   so you only need the `access_token`!
2. Get users listed on keycloak's db using the obtained `access_token` (from the 1st step):
   - **Get** request to: http://localhost:8080/admin/realms/GreenDash/users?briefRepresentation=true so `briefRepresentation` should be added as query param.
   - Add to the headers of the request the `access_token` in the form:
   ```
   {  Authorization: Bearer eyJhbGciOiJSUz...}
   ```
   - It will return the list of Users as:
   ```
   [
     {
           "id": "96644d8a-c1ea-443c-b184-a161d488dd82", //just example
           "createdTimestamp": ,
           "username": "example_Name",
           "enabled": true,
           "emailVerified": false,
           "firstName": "",
           "lastName": "",
           "email": "",
           "access": {}
      },
      {
           ....
      },
   ]
   ```
   so you will only need `id` & `username` to make the association.

### Keycloak

Admin URL: http://localhost:8080
