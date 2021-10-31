# Backend Rest API documentation

[TOC]

## Users

The users API allows to get information about a user

### Log in

#### Request

```http
POST /login
```

##### Header

```
Content-type: application/json
```

##### Body

Json containing the name, email and password of the new user.

```js
{
    username:"yaya",
    password:"hlililiub"
}
```

#### Response

```
Status: 200 OK
```

```js
{
    name: "Davis Spinage",
    username": "yaya",
    id: "HlQlV9hwYlMVJenAiq761oWnOBE3"
}
```

#### Possible errors

`require authentication` `internal server error`

### Create user (sign up)

#### Request

```http
POST /signup
```

##### Header

```
Content-type: application/json
```

##### Body

Json containing the name, email and password of the new user.

```js
{
    name:"Davis Spinage",
    username:"yaya",
    password:"hlililiub"
}
```

#### Response

```
Status: 200 OK
```

```js
{
    name: "Davis Spinage",
    username": "yaya",
    id: "HlQlV9hwYlMVJenAiq761oWnOBE3"
}
```

#### Possible errors

`bad request` `internal server error`

### Get user infos

#### Request

```http
GET /users/:userID
```

##### Parameters

`userID`: int

#### Response

```
Status: 200 OK
```

```js
{
    id:"hiuiuhnootu",
    name:"Jotaro Kujo",
    username:"Jojo@gmail.com",
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error`

### Get user projects

Get a brief summary of all the projects of the user.

_Pagination will be implemented if there is time._

#### Request

```http
GET /users/:userID/projects
```

##### Parameters

`userID`: int

#### Response

```
Status: 200 OK
```

```js
{
  projects: [
    {
      id: 'hhdjkjdm',
      name: 'online-ide',
      shared: true,
      lastUpdated: 2334111,
    },
    {
      id: 'jjddll',
      shared: false,
      name: 'quiz-app',
      lastUpdated: 233781,
    },
  ];
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Get user files

Get a brief summary of all the files of the user.

_Pagination is highly recommended here. But it will be implemented if there is time._

#### Request

```http
GET /users/:userID/files
```

##### Parameters

`userID`: int

#### Response

```
Status: 200 OK
```

```js
{
  files: [
    {
      id: 1,
      projectId: 555,
      name: 'index.ts',
      lastUpdated: 2334111,
    },
    {
      id: 55,
      projectId: 545,
      name: 'components/sidebar.tsx',
      lastUpdated: 233781,
    },
    {
      id: 567,
      projectId: 565,
      name: 'routers/home.ts',
      lastUpdated: 233781,
    },
  ];
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

## Projects

### Create project

#### Request

```http
POST /users/:userID/projects/create
```

##### Parameters

`userID`: int

##### Header

```
content-type: application/json
```

##### Body

JSON file containing all the information of the file. All properties are mandatory.

```js
{
  name: "online-ide",
  creationDate: 44456,
}
```

#### Response

```
Status: 200 OK
```

```js
{
  id: 654,
  name: "online-ide",
  lastUpdated": 44456,
  shared: false,
}
```

#### Possible errors

`bad request` `require authentification` `internal server error` `forbidden`

### Get project

Get all informations of a project. The contents of the files are not included.

#### Request

```http
GET /users/:userID/projects/:projectID
```

##### Parameters

`projectID`: int
`userID`: int

#### Response

```
Status: 200 OK
```

```js
{
    id:"37gsgsg7",
    name:"Jojo-bizzare-adventure",
    shared:true,
    owner:{name:"Joseph Joestar", id:"56636"},
    collaborators:[
        {id: 7363 , name: "Jotaro Kujo"},
    ],
    // The files array is sorted in ascending alphabetical order with the file names
    files:[
      {id:555, name:"server/src/index.ts"},
        {id:4567, name:"src/components/header.tsx"},
        {id:45636, name:"src/components/sidebar.tsx"},
    ],
    creationDate:2334111,
    lastUpdated:2334111,
},
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Create Collaboration on project

#### Request

```http
POST /users/:userID/projects/:projectID/collab
```

##### Parameters

`projectID`: int
`userID`: int

#### Response

```
Status: 200 OK
```

##### Body

JSON file containing the id of the collaboration room

```js
{roomID: "ehe6d7dhHDHe8"}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Get collaboration project

#### Request

```http
POST /users/:userID/projects/collab/:collabID
```

##### Parameters

`projectID`: int
`userID`: int
`collabID`: int

#### Response

```
Status: 200 OK
```

```js
{
    id:"37gsgsg7",
    name:"Jojo-bizzare-adventure",
    shared:true,
    owner:{name:"Joseph Joestar", id:"56636"},
    collaborators:[
        {id: 7363 , name: "Jotaro Kujo"},
    ],
    // The files array is sorted in ascending alphabetical order with the file names
    files:[
      {id:555, name:"server/src/index.ts"},
        {id:4567, name:"src/components/header.tsx"},
        {id:45636, name:"src/components/sidebar.tsx"},
    ],
    creationDate:2334111,
    lastUpdated:2334111,
}
```


#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Edit project

#### Request

```http
PATCH /users/:userID/projects/:projectID/edit
```

##### Parameters

`projectID`: int
`userID`: int

##### Header

```
content-type: application/json
```

##### Body

JSON file whose properties are the information to be updated. The example below shows all the properties that can be updated, But a request does not have to feature all of them. Only the ones to be updated are required. However, at least one must be included for the request to be valid.

```js
{
  name: "awesome-online-ide",
  collaborators: [
        {id: 7363 , name: "Jotaro Kujo"},
    ],
  lastUpdated: 656566,
  shared: true
}
```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Delete project

#### Request

```http
DELETE /projects/:projectID
```

##### Parameters

`projectID`: int

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

## Files

### Create file

#### Request

```http
POST /users/:userID/projects/:projectID/files/create
```

##### Parameters

`userID`: int
`projectID`: int

##### Header

```
content-type: application/json
```

##### Body

JSON file containing all the information of the file. All properties are mandatory.

```js
{
  name: "/src/controllers/user.ts",
  creationDate: 44456,
}
```

#### Response

```
Status: 200 OK
```

```js
{
  id: 6754,
  name: "/src/controllers/user.ts",
  lastUpdated: 7366,
  projectId: "gdgdhhd88"
}
```

#### Possible errors

`bad request` `require authentification` `internal server error` `forbidden`

### Get file

Get all information of a file in a project, content not included.

#### Request

```http
GET /users/:userID/projects/:projectID/files/:fileID
```

##### Parameters

`userID`: int
`fileID`: int
`projectID`: int

#### Response

```
Status: 200 OK
```

```js
{
  id: 555,
  name: "server/src/index.ts",
  creationDate: 645466,
  lastUpdated: 736636,
  projectId: 6664,
  owner: {userID: 3444, name: "Joseph Joestar"}
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Get file content

#### Request

```http
GET /users/:userID/projects/:projectID/files/:fileID/content
```

##### Parameters

`fileID`: int
`projectID`: int
`userID`: int

#### Response

```
Status: 200 OK
```

##### Header

```
content-type: application/octet-stream
```

##### Body

```
(File in a js buffer)
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Edit file

Edit all file properties except the content

#### Request

```http
PATCH /users/:userID/projects/:projectID/files/:fileID
```

##### Parameters

`userID`: int
`projectID`: int
`fileID`: int

##### Header

```
content-type: application/json
```

##### Body

Json whose properties are the information to be updated. The example below features all the properties that can be updated, But a request does not have to feature all of them. Only the ones to be updated are required.

```js
{
  name: "src/index.ts",
  lastUpdated: 656566
}
```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Update file content

Edit all file properties except the content

#### Request

```http
PUT /users/:userID/projects/:projectID/files/:fileID/content/
```

##### Parameters

`userID`: int
`projectID`: int
`fileID`: int

##### Header

```
content-type: application/octet-stream
```

##### Body

```
(File in a js buffer)
```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

### Delete file

#### Request

```http
DELETE /users/:userID/projects/:projectID/files/:fileID
```

##### Parameters

`userID`: int
`projectID`: int
`fileID`: int

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `internal server error` `forbidden`

## Errors

#### Bad request

```
Status: 400 Bad request
```

#### Require authentication

```
Status: 401 Unauthorized
```

#### Resource not found

```
Status: 404 Not Found
```

#### Internal server error

The server has encountered a situation it doesn't know how to handle.

```
Status: 500 Internal Server Error
```

#### Forbidden

The user is authenticated, but it’s not allowed to access a resource.

```
Status: 403 Forbidden
```

