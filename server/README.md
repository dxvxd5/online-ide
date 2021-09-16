# Backend Rest API documentation

## `Users`

The users API allows to get information about a user

### Create user

(need to some tests)

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

```json
{
    id:1,
    name:'Jotaro Kujo',
    username:'Jojo',
    photo?
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable`

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

```json
{
	projects: [
        {
            id:1,
            name:'online-ide',
            shared:true,
            lastOpenedDate:2334111, # from the JS Date API
        },
    	{
            id:55,
            shared:false,
            name:'quiz-app',
            lastOpenedDate:233781,
        }
    ]
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

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

```json
{
	files : [
        {
            id:1,
            projectId:555,
            name:'index.ts',
            lastOpenedDate:2334111, # from JS Date API
        },
    	{
            id:55,
            projectId:545,
            name:'components/sidebar.tsx',
            lastOpenedDate:233781, # from JS Date API
        },
    	{
            id:567,
            projectId:565,
            name:'routers/home.ts',
            lastOpenedDate:233781, # from JS Date API
        }
    ]
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

## `Projects`

### Create project

#### Request

```http
POST projects/
```

##### Header

```
content-type: application/json
```

##### Body

JSON file containing all the information of the file. All properties are mandatory.

```json
{
  "name": "online-ide",
  "creationDate": 44456,
  "owner": "Jonathan Joestar"
}
```

#### Response

```
Status: 200 OK
```

```json
{
  "id": 654,
  "name": "online-ide",
  "creationDate": 44456,
  "owner": "Jonathan Joestar",
  "lastOpenedDate": 44456,
  "files": [],
  "shared": false,
  "collaborators": []
}
```

#### Possible errors

`bad request` `require authentification` `service unavailable` `forbidden`

### Get project

Get all informations of a project. The contents of the files are not included.

#### Request

```http
GET /projects/:projectID
```

##### Parameters

`projectID`: int

#### Response

```
Status: 200 OK
```

```json
{
    id:1,
    name:'Jojo-bizzare-adventure',
    shared:true,
    owner:'Joseph Joestar',
    collaborators:[
        'Joseph Joestar',
        'Jotaro Kujo',
    ],
    files:[
        {id:45636, name:'src/components/sidebar.tsx'},
        {id:4567, name:'src/components/header.tsx'},
        {id:555, name:'server/src/index.ts'}
    ]
    creationDate:2334111, # from JS Date API
    lastOpenedDate:2334111, # from JS Date API
},
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

### Edit project

#### Request

```http
PATCH /projects/:projectID
```

##### Parameters

`projectID`: int

##### Header

```
content-type: application/json
```

##### Body

Json whose properties are the information to be updated. The example below features all the properties that can be updated, But a request does not have to feature all of them. Only the ones to be updated are required.

```json
{
  "name": "awesome-online-ide",
  "collaborators": ["Jotaro Kujo", "Joseph Joestar"],
  "lastOpenedDate": 656566,
  "shared": true
}
```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

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

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

## `Files`

### Create file

#### Request

```http
POST projects/:projectID/files/
```

##### Parameters

`projectID`: int

##### Header

```
content-type: application/json
```

##### Body

JSON file containing all the information of the file. All properties are mandatory.

```json
{
  "name": "/src/controllers/user.ts",
  "creationDate": 44456,
  "owner": "Jonathan Joestar"
}
```

#### Response

```
Status: 200 OK
```

```json
{
  "id": 6754,
  "name": "/src/controllers/user.ts",
  "creationDate": 44456,
  "owner": "Jonathan Joestar",
  "lastOpenedDate": 7366,
  "projectId": 664
}
```

#### Possible errors

`bad request` `require authentification` `service unavailable` `forbidden`

### Get file

Get all informations of a file in a project, content not included.

#### Request

```http
GET projects/:projectID/files/:fileID
```

##### Parameters

`fileID`: int

`projectID`: int

#### Response

```
Status: 200 OK
```

```json
{
  "id": 555,
  "name": "server/src/index.ts",
  "creationDate": 645466,
  "lastOpenedDate": 736636,
  "projectId": 6664,
  "owner": "Joseph Joestar"
}
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

### Get file content

#### Request

```http
GET projects/:projectID/files/:fileID/content
```

##### Parameters

`fileID`: int

`projectID`: int

#### Response

```
Status: 200 OK
```

```
(need to do some tests first)
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

### Edit file

Edit all file properties except the content

#### Request

```http
PATCH /projects/:projectID/files/:fileID
```

##### Parameters

`projectID`: int

`fileID`: int

##### Header

```
content-type: application/json
```

##### Body

Json whose properties are the information to be updated. The example below features all the properties that can be updated, But a request does not have to feature all of them. Only the ones to be updated are required.

```json
{
  "name": "src/index.ts",
  "lastOpenedDate": 656566
}
```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

### Update file content

Edit all file properties except the content

#### Request

```http
PATCH /projects/:projectID/files/:fileID/content
```

##### Parameters

`projectID`: int

`fileID`: int

##### Header

```
content-type: (need to do some tests)
```

##### Body

```json

```

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

### Delete file

#### Request

```http
DELETE /projects/:projectID/files/:fileID
```

##### Parameters

`projectID`: int

`fileID`: int

#### Response

```
Status: 204 No Content
```

#### Possible errors

`bad request` `require authentification` `resource non found` `service unavailable` `forbidden`

## `Errors`

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

#### Service unavailable

Something unexpected happened server-side

```
Status: 503 Service Unavailable
```

#### Forbidden

The user is authenticated, but it’s not allowed to access a resource.

```
Status: 403 Forbidden
```
