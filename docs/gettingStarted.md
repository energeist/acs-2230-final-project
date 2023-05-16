# Getting Started

!> You MUST sign up and login to be able to use the functions of this API

## Authorizing with Postman
### Signing up for an account:
- Make a POST request to **/users/signup**
- In the body of your request, include a username, email and password of your choice.  For example:
```json
{
    "username": "uniquename",
    "email": "youremail@domain.com",
    "password": "v3ryS3cur3p4$$w0rD!"
}
```
- - Username and email must be **unique**!
- Send the request and you will receive a response that looks like this:
```json
{
    "message": "Sign-up successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDzzzzzzMGJjMDZhMDEzOTM5NTRmYjkiLCJpYXQiOjE2ODQyMDUzNzYsImV4cCI6MTY4OTM4OTM3Nn0.FgI6mf4FuCXOTfFLBwFOal_qgxVdqC0kJK-P70eKjo4"
}
```

### Logging in with your account:
- Make a POST request to **/users/login**
- In the body of your request, include your username and password.  For example:
```json
{
    "username": "uniquename",
    "password": "v3ryS3cur3p4$$w0rD!"
}
```
- Send the request and you will receive a response that looks like this:
```json
{
    "message": "Successfully logged in. Please include your JWT as a bearer token in your API requests",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYyZWY0MGJjMDZhMDEzOTM5NTRmYjkiLCJ1c2VybmFtZSI6InVuaXF1ZW5hbWUiLCJpYXQiOjE2ODQyMDU1MzMsImV4cCI6MTY4NTUwMTUzM30.517ofsGxj9LYIyVYvS4KdP6_F4ZqwEcoHvwm2Y6xaaQ"
}
```

### Authorizing your requests:
- Click the 'Auth' tab in Postman
- From the 'Type' dropdown, select 'Bearer Token'
- Paste the token you received from logging in into the 'Token' box and you're good to go! Happy CatSearching, go pet some cats!

### Logging out:
- To end your session, make a GET request to **users/logout**
