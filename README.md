# Collaborative online IDE

## Purpose

The purpose of the application is to offer a space where developers can collaborate in real-time on code. 

The application will have roughly the same features as [CodeSandbox](https://codesandbox.io/)

## Features

### Personal space
When users create an account on the application, they get access to a personal space. 
In this personal space is saved all the files they have worked on and all the users they have collaborated with. 
Each time users log in, they see a quick summary of their personal space (mainly their recent files and collaborators). 
- Projects : several files in a folder can be opened on the web editor. 

### Full-fledged code editor
Users have access to a full-fledged code editor with the following features:
- Syntax highlighting
- Code completion
- Code running?
- Drag and drop file to open it
- Upload file to open it
- Download file

### Collaborative code editing
Several users (how many max?) can collaborate on a file together in real-time.
Users can see on their respective editors a cursor showing where their collaborators are in the file. 
Users can invite other users to collaborate together on a file.

### Compiler

### Others
- User can log in with their GitHub account
- User can change their profile picture



## Tech

- Sockets: [socket.io](https://socket.io/)
- Online code editor: [Ace](https://ace.c9.io/)/[CodeMirror](https://codemirror.net/6/)/[Monaco](https://microsoft.github.io/monaco-editor/index.html) 

## Grading criteria

These are the technologies that we will certainly need for this project and their associated points.

| Functionality                           | When/Why                       | Points |
| --------------------------------------- | ------------------------------ | ------ |
| Drag and drop                           | To open a new file             | 3      |
| Media upload                            | When updating profile picture  | 3      |
| Text (code) editor                      | Obvious                        | 5      |
| Collaborative feature with shared state | Obvious                        | 5      |
| Regex                                   | To check email when signing up | 3      |
|                                         | **Total**                      | **19** |



| JS/CSS/NPM            | When/Why                        | Points |
| --------------------- | ------------------------------- | ------ |
| CSS naming convention |                                 | 5      |
| CSS preprocessor      |                                 | 5      |
| Lodash package        | For all utility functions       | 5      |
| Formik package        | Form for user to sign up/log in | 3      |
| TypeScript            |                                 | 15     |
|                       | **Total**                       | **33** |



| Advanced model/React & Performance                       | When/Why                                  | Points |
| -------------------------------------------------------- | ----------------------------------------- | ------ |
| Normalize nested data in model (e.g. use normalizr)      | Make sure our model get updated correctly | 5      |
| No big unnecessary DOM update                            | Performance                               | 3      |
| Memoization of all functions created in React components | Performance                               | 3      |
| Memoization of all computationally heavy functions       | Performance                               | 2      |
| Lazy-loading of bundle                                   | Performance                               | 10     |
| Use PropTypes/interface/type to declare component props  | Fewer bugs                                | 2      |
|                                                          | **Total**                                 | **25** |



| Server & Deployment                                          | When/Why/How                                                 | Points |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| Node (express.js framework or plain node) (*If you create a web server, all communication with the database must go through the server. Otherwise Fx*) | To implement the server                                      | 10     |
| Websocket multiplayer                                        | To implement real-time collaboration                         | 10     |
| Use cookies                                                  | Certainly to save some values we want to persist (like the id of the last file opened by the user or the theme used by the user) | 5      |
| Good use of GET, POST, PUT, DELETE requests                  | e.g. Don't send sensitive data in GET, don't fetch stuff in DELETE request | 5      |
| Good error codes                                             | e.g. 401 not authorized, 404 not found, 500 server error + good error message | 5      |
| Host app in Docker container                                 |                                                              | 15     |
|                                                              | **Total**                                                    | **50** |

### **Total**: **127 ** --> Grade A

