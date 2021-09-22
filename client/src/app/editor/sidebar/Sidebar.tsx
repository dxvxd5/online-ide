/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Files from './Files';

const Sidebar = (props: {
  sections: string[];
  files: {
    name: string;
    content: string;
    section: string;
  }[];
  activeFile: {
    name: string;
    content: string;
    section: string;
  };
  openFile: (file: { name: string; content: string; section: string }) => void;
  setActiveFile: React.Dispatch<
    React.SetStateAction<{
      name: string;
      content: string;
      section: string;
    }>
  >;
}) => {
  return (
    <>
      <div className="sidebar">
        <div className="header">PlaygroundStudio</div>
        <Files
          sections={props.sections}
          files={props.files}
          activeFile={props.activeFile}
          openFile={props.openFile}
          setActiveFile={props.setActiveFile}
        />
      </div>
    </>
  );
};

export default Sidebar;
