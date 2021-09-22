/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { monaco } from 'react-monaco-editor';
import Sidebar from './sidebar/Sidebar';

import './editor.scss';
import Main from './Main';

const PlaygroundStudio = (props: {
  sections: string[];
  files: {
    name: string;
    content: string;
    section: string;
  }[];
  codeIsHappening: (newCode: string) => void;
  code: string;
}) => {
  const editorReference = React.createRef() as React.RefObject<any>;
  // const [editorReference2, setEditorReference2] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [openFiles, setOpenFiles] = useState(props.files);
  const [activeFile, setActiveFile] = useState(props.files[0]);
  const [activeSidebar, setActiveSidebar] = useState('files');
  const openFile = (file: {
    name: string;
    content: string;
    section: string;
  }) => {
    const openFilesCopy = [...openFiles];
    if (!openFilesCopy.find((f) => f.name === file.name)) {
      openFilesCopy.push(file);
      setOpenFiles(openFilesCopy);
    }
  };
  const closeFile = (file: { name: string }) => {
    const openFilesCopy = [...openFiles];
    const index = openFilesCopy.findIndex((f) => f.name === file.name);
    openFilesCopy.splice(index, 1);
    if (!openFilesCopy.length) {
      setActiveFile(null as any);
    } else {
      setActiveFile(openFilesCopy[0]);
    }
    setOpenFiles(openFilesCopy);
  };
  const onWrite = (value: string) => {
    props.codeIsHappening(value);
    const activeFileCopy = { ...activeFile };
    activeFileCopy.content = value;
    setActiveFile(activeFileCopy);
  };

  return (
    <div className="Editor">
      <Sidebar
        sections={props.sections}
        files={props.files}
        activeFile={activeFile}
        openFile={openFile}
        setActiveFile={setActiveFile}
      />
      <Main
        editorReference={editorReference}
        showSidebar={showSidebar}
        openFiles={openFiles}
        activeFile={activeFile}
        onWrite={onWrite}
        setActiveFile={setActiveFile}
        setShowSidebar={setShowSidebar}
        closeFile={closeFile}
        codeIsHappening={props.codeIsHappening}
        code={props.code}
      />
    </div>
  );
};

export default PlaygroundStudio;
