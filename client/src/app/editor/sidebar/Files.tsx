/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import languageIcon from '../languageIcon';

const Files = (props: {
  sections: string[];
  files:
    | {
        name: string;
        content: string;
        section: string;
      }[]
    | never[];
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
  const [sectionsStatus, setSectionsStatus] = useState(
    props.sections.map((section) => {
      return {
        name: section,
        toggle: true,
      };
    })
  );
  return (
    <>
      <ul className="sections">
        {sectionsStatus.map((section, i) => {
          const sectionFiles = props.files.filter(
            (f) => f.section === section.name
          );
          return (
            <li key={`section${i + 1}`} value={`${section.toggle}`}>
              <span className="sectionName">{section.name}</span>
              <ul>
                {sectionFiles.map((file, i2) => {
                  const icon = languageIcon(file.name);
                  return (
                    <li
                      key={`main${file.name}${i2 + 1}`}
                      onClick={() => {
                        props.openFile(file);
                        props.setActiveFile(file);
                      }}
                      value={`${
                        props.activeFile.name === file.name &&
                        props.activeFile.section === file.section
                      }`}
                    >
                      {icon}
                      {file.name}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Files;
