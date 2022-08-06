# wow-chat

## Setup
List of command to setup api
 - `npm i`
 - `Postman Using Authorization Bearer token`

## Run Server And Test
List of command
  - `npm start`
  - `npm test`

## Endpoints
List of available endpoints
  - `POST /user/register`
  - `POST /user/login`
  - `POST /chat/send`
  - `GET /chat/my-chat/:receiver_id`
  - `GET /chat/last-chat`

### 1. POST /user/register
  Description: Create User

  Request:
  - body
  ```json
    "username": "string",
    "password": "string"
  ```

  Response:
  - 201 Created
  ```json
  {
    "message": "Success Registered User"
  }
  ```
  - 400 Bad Request
  ```json
  {
    "status": 400,
    "message": "Username Has Been Taken"
  }
  OR
  {
    "status": 400,
    "messages": [
        "Username is Required"
    ]
  }
  OR
  {
    "status": 400,
    "messages": [
        "Password is Required"
    ]
  }
  OR
  {
    "status": 400,
    "messages": [
        "Username is Required",
        "Password is Required"
    ]
  }
  ```

### 2. POST /user/login
Description: User Login

  Request:
  - body
  ```json
    "username": "string",
    "password": "string"
  ```

  Response:
  - 200 OK
  ```json
  {
    "username": "string",
    "access_token": "string"
  }
  ```
  - 400 Bad Request
  ```json
  {
    "status": 400,
    "message": "Username or Password is Wrong"
  }
  ```

### 3. POST /chat/send
Description: Send and Reply Chat

  Request:
  - header
  ```json
    "authorization": "Bearer access_token"
  ```
  - body
  ```json
  {
    "receiver": "integer",
    "message": "string",
    "reply_to":"integer" (not required)
  }
  ```

  Response:
  - 201 Created (with no reply)
  ```json
  {
    "id": "integer",
    "sender": "integer",
    "receiver": "integer",
    "message": "string"
  }
  ```
  - 201 Created (with reply)
  ```json
  {
    "id": "integer",
    "sender": "integer",
    "receiver": "integer",
    "message": "string",
    "reply_to_message": {
        "reply_to": "integer",
        "message_replied": "string"
    }
  }
  ```
  - 400 Bad Request
  ```json
  {
    "status": 400,
    "messages": [
        "Chat Message Is Required"
    ]
  }
  ```
  - 404 Not Found Receiver User
  ```json
  {
    "status": 404,
    "message": "Target Receiver Not Found"
  }
  ```
  - 401 Unauthorized
  ```json
  {
    "status": 401,
    "message": "Invalid Token"
  }
  ```

### 4. GET /chat/my-chat/:receiver_id
Description: Get Conversation with specific user
Request:
  - header
  ```json
    "authorization": "Bearer access_token"
  ```
  - params
  ```json
    "receiver_id": "integer"
  ```
Response:
  - 200 OK
  ```json
  [
    {
        "messages_id": 5,
        "sender": {
            "id": 5,
            "username": "bimo"
        },
        "receiver": {
            "id": 5,
            "username": "elita"
        },
        "messages": "ada apa"
    },
   ...
  ]
  ```
  - 404 Not Found, Other User Not Registered
  ```json
  {
    "status": 404,
    "message": "Target Receiver Not Found"
  }
  ```
  - 401 Unauthorized
  ```json
  {
    "status": 401,
    "message": "Invalid Token"
  }
  ```

### 5. GET /chat/last-chat
Description: Get all last chat from where The CURRENT USER involved with the conversation
Request:
  - header
  ```json
    "authorization": "Bearer access_token"
  ```
Response:
  - 200 OK
  ```json
    [
      {
          "id": 5,
          "sender": 5,
          "message": "ada apa",
          "receiver": 1,
          "reply_to": null,
          "createdAt": "2022-08-05T16:49:36.853Z",
          "updatedAt": "2022-08-05T16:49:36.853Z",
          "sender_data": {
              "id": 5,
              "username": "elita",
              "createdAt": "2022-08-05T14:48:50.912Z",
              "updatedAt": "2022-08-05T14:48:50.912Z"
          },
          "receiver_data": {
              "id": 1,
              "username": "bimo",
              "createdAt": "2022-08-05T13:55:42.529Z",
              "updatedAt": "2022-08-05T13:55:42.529Z"
          }
      },
      ...
    ]
```
- 401 Unauthorized
```json
{
  "status": 401,
  "message": "Invalid Token"
}
```

## GLOBAL ERROR
```json
{
  "code": 500,
  "message": "Internal Server Error"
}
```