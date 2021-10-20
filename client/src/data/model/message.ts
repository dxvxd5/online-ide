enum Message {
  // When the user name is set
  NAME_CHANGE,

  // When the user id is set
  ID_CHANGE,

  // When the user username is set
  USERNAME_CHANGE,

  // when the user is logged in
  LOGIN,

  // when the user is logged out
  LOGOUT,

  // When the user has signed up
  SIGNUP,

  // when setting all the project of the user
  PROJECTS_CHANGE,

  // when we set the currently opened project
  CURRENT_PROJECT,

  // when setting the currently open files
  CURRENT_TABS,

  // when setting the file we are currently working on
  FOCUSED_FILE,

  // when one user that is not the host leave the ongoing collaboration
  USER_LEFT,

  // when one user join the ongoing collaboration
  USER_JOIN,

  // When a collaborator has changed their focused file
  COLLAB_FOCUSED_FILE_CHANGE,

  // when the collaboration stop
  COLLAB_STOPPED,

  // when the host leave the ongoing collaboration
  HOST_LEFT,

  // when the collaboration session start
  COLLAB_STARTED,

  // when a user moves their cursor in the editor
  CURSOR_MOVED,

  // when a user make a selection in the editor
  EDITOR_SELECTION,

  // when the content of the editor change during a collaboration
  CONTENT,

  // When updating the file tree
  UPDATE_TREE,

  // When we scroll in the editor
  EDITOR_SCROLL,

  // When the array of followers changes
  FOLLOWER_CHANGE,

  // when we update the leader
  LEADER_CHANGE,

  // When we remove a file from the tab
  TAB_FILE_CLOSE,
}

export default Message;
