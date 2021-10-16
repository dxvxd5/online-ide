/* eslint-disable react/style-prop-object */
import React from 'react';
import Button from '../button/button';

import '../../../assets/styles/project.css';
import when from '../../../utils/date';

interface ProjectsData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

interface ProjectProps {
  project: ProjectsData;
  remove: (id: string) => void;
  open: (id: string) => void;
}

export default function Project({
  project,
  open,
  remove,
}: ProjectProps): JSX.Element {
  const { name, lastUpdated, id } = project;

  const whenDidUpdate = when(lastUpdated);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="project">
      <div className="project__infos">
        <div className="project__name">{name}</div>
        <div className="project__date">{whenDidUpdate}</div>
      </div>
      <div className="project__buttons">
        <Button
          submit={false}
          className="project__open"
          onClick={() => open(id)}
          text="Open"
          theme="main"
        />
        <Button
          submit={false}
          className="project__delete"
          onClick={() => remove(id)}
          text="Delete"
          theme="red"
        />
      </div>
    </div>
  );
}
