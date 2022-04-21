<h1 align="center">
  <img src="https://i.imgur.com/gNNuQK3.png"/><br/>
  Collaborative online IDE
</h1>
<p align="center"> A space where developers can collaborate in real-time on code👨🏾‍💻👩🏾‍💻. <br/> </p>

## Features

### Personal space

When users create an account on the application, they get access to a personal space, where they can see all their projects and edit them.

### Full-fledged code editor

Users have access to a full-fledged code editor with syntax highlighting and autocompletion (for the languages supported by monaco editor)

### Collaborative code editing

- Several users can collaborate on a file together in real-time.
- Users can see on their respective editors a cursor showing where their collaborators are in the file.
- Users can invite other users to collaborate together on a project.

## Future improvements

- Code execution
- Upload file
- File download
- Github integration
- Better support for programming languages
- Following feature during collaboration

## How to run the app locally
- [Create a new firebase project](https://codinglatte.com/posts/how-to/how-to-create-a-firebase-project/). Add a Firestore instance to this project. 
- To install all the dependencies, run `npm install` in the root folder `online-ide`, the `client` folder and the `server` folder. 
- Create a `.env` file in the `server` folder. Fill it with the Json file containing your firebase project [service accout key](https://firebase.google.com/docs/admin/setup#initialize-sdk). The `.env` file should be like so: 
```
# Firebase project configuration
FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT= __json containing the service account key__

# Password hashing configuration
HASH_CONFIG_ITERATION=100000
HASH_CONFIG_KEYLEN=128
HASH_CONFIG_DIGEST=sha512
HASH_CONFIG_SALT_LEN=64
```
- Use the function `genKeyPair` in the file `online-ide/server/src/utils/jwt.ts` to generate the RSA keys used by the server to sign the jwt tokens. It should create a folder named `keys` containing the files `id_rsa_private.pem` and `id_rsa_pub.pem` in the `server` folder 
- Run the entire application (both client and server) by executing the command `npm run dev` in the project root directory `online-ide`.

