import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import User from '../components/connectedUsers/User';

interface CodeEditorViewProp {
  connectedUsers: { id: string; username: string }[];
  connectedUser: { id: string; username: string };
  socketClient: React.MutableRefObject<SocketIOClient.Socket | undefined>;
  codeEditorTokens: string[];
  code: string;
  codeIsHappening: (newCode: string) => void;
  monacodidmount: (editor: { focus: () => any }) => void;
  editorReference: React.RefObject<any>;
  clearCode: () => void;
}

const CodeEditorView = ({
  connectedUsers,
  connectedUser,
  socketClient,
  codeEditorTokens,
  code,
  codeIsHappening,
  monacodidmount,
  editorReference,
  clearCode,
}: CodeEditorViewProp) => {
  return (
    <>
      <h1>Room token: {codeEditorTokens[0]}</h1>
      <h2>Users in the room:</h2>
      <ul>
        {connectedUsers.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </ul>
      {/*       <ModeSelect mode={mode} changeMode={changeMode} />
      <ThemeSelect theme={theme} changeTheme={changeTheme} />
 */}
      <MonacoEditor
        width="100%"
        height="410"
        className="monacoEditor"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{}}
        onChange={codeIsHappening}
        editorDidMount={monacodidmount}
        ref={editorReference}
      />
      {/*       <br />
      <SaveButton
        text={this.state.code}
        lang={this.state.mode}
        title={this.props.challenge.title}
      />
      <br />
 */}
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          clearCode();
        }}
        className="col-lg-12"
      >
        clear code
      </button>
    </>
  );
};

export default CodeEditorView;
