/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import MonacoEditor from 'react-monaco-editor';

const Main = (props: {
  showSidebar: boolean;
  openFiles: {
    name: string;
    content: string;
    section: string;
  }[];
  activeFile: {
    name: string;
    content: string;
    section: string;
  };
  editorReference: React.RefObject<any>;
  onWrite: (value: string) => void;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFile: React.Dispatch<
    React.SetStateAction<{
      name: string;
      content: string;
      section: string;
    }>
  >;
  closeFile: (file: { name: string }) => void;
  codeIsHappening: (newCode: string) => void;
  code: string;
}) => {
  const monacodidmount = (editor: { focus: () => any }) => {
    editor.focus();
  };

  console.log('onWrite: ', props.codeIsHappening);

  return (
    <>
      <div className="main">
        <div
          className="header"
          style={{
            paddingLeft: props.showSidebar ? '220px' : '40px',
            width: props.showSidebar
              ? 'calc(100% - 220px)'
              : 'calc(100% - 40px)',
          }}
        >
          <ul>
            {!props.showSidebar && (
              <li
                className="showSidebar"
                onClick={() => props.setShowSidebar(true)}
              />
            )}
            {props.openFiles.map((file, i) => {
              return (
                <li
                  key={`sidebar${file.name}${i + 1}`}
                  // Should alight the section name with brighter color to indicate the section being active
                  // active={
                  value={`${
                    props.activeFile.name === file.name &&
                    props.activeFile.section === file.section
                  }`}
                >
                  <span onClick={() => props.setActiveFile(file)}>
                    {file.name}
                  </span>
                  <span onClick={() => props.closeFile(file)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className="monaco"
          style={{
            paddingLeft: props.showSidebar ? '220px' : '40px',
          }}
        >
          <MonacoEditor
            width="100%"
            height="410"
            language="javascript"
            theme="vs-dark"
            value={props.code}
            options={{}}
            onChange={props.onWrite}
            editorDidMount={monacodidmount}
            ref={props.editorReference}
          />
        </div>
      </div>
    </>
  );
};

export default Main;
