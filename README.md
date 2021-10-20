# Collaborative online IDE

## Purpose

The purpose of the application is to offer a space where developers can collaborate in real-time on code.

## Features

### Personal space
When users create an account on the application, they get access to a personal space, where they can see all their projects and edit them. 

### Full-fledged code editor
Users have access to a full-fledged code editor with syntax highlightning and autocompletion (for the languages supported by monaco editor)


### Collaborative code editing
- Several users can collaborate on a file together in real-time.
- Users can see on their respective editors a cursor showing where their collaborators are in the file. 
- Users can invite other users to collaborate together on a project.

## Tech

- Sockets: [socket.io](https://socket.io/)
- Online code editor: [Monaco](https://microsoft.github.io/monaco-editor/index.html) 


## Grading criteria

These are the technologies that we will certainly need for this project and their associated points.

| Functionality                           | When/Why                       | Points |
| --------------------------------------- | ------------------------------ | ------ |
| Text (code) editor                      | Obvious                        | 5 ✅     |
| Collaborative feature with shared state | Obvious                        | 5 ✅     |
| Regex                                   | server side | 3 ✅     |
|                                         | **Total**                      | **13** |



| JS/CSS/NPM            | When/Why                        | Points |
| --------------------- | ------------------------------- | ------ |
| CSS naming convention |  Using BEM                               | 5 ✅     |
| Lodash package        | For all utility functions       | 5  ✅    |
| Formik package        | Form for user to sign up/log in | 3  ✅    |
| TypeScript            |                                 | 15 ✅    |
|Promise all              | in file model| 3 ✅ |
| Use animation package or CSS animation|  | 5  ✅    |
|                       | **Total**                       | **36** |



| Advanced model/React & Performance                       | When/Why                                  | Points |
| -------------------------------------------------------- | ----------------------------------------- | ------ |
| No big unnecessary DOM update                            | Performance                               | 3    ✅    |
| Use PropTypes/interface/type to declare component props  | Fewer bugs                                | 2   ✅   |
|                                                          | **Total**                                 | **5**|


| Consistency                   | When/Why                                  | Points |
| -------------------------------------------------------- | ----------------------------------------- | ------ |
| Re-using UI-Components    | | 5 ✅|
|                                                          | **Total**                                 | **5**|

| Server & Deployment                                          | When/Why/How                                                 | Points |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| Node (express.js framework or plain node) (*If you create a web server, all communication with the database must go through the server. Otherwise Fx*) | To implement the server                                      | 20  ✅   |
| Websocket multiplayer                                        | To implement real-time collaboration                         | 10   ✅  |
| Good use of GET, POST, PUT, DELETE requests                  | e.g. Don't send sensitive data in GET, don't fetch stuff in DELETE request | 5 ✅|
| Good error codes                                             | e.g. 401 not authorized, 404 not found, 500 server error + good error message | 5 ✅ |
| Deploy server without docker                                 |                                                              | 15  ✅ |
| Handle authorization  | With JWT                              | 10  ✅  |
|                                                              | **Total**                                                    | **65** |

### **Total**: 124  --> Grade A

## Future improvements
- Code execution
- Upload file
- File download
- Github integration
- Better support for programming languages
- Following feature during collaboration
