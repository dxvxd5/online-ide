import React from 'react';
import Button from '../button/Button';
import when from '../../../utils/date';

import '../../../assets/styles/project.css';

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
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
}

export default function Project({
  project,
  open,
  remove,
  style,
}: ProjectProps): JSX.Element {
  const { name, lastUpdated, id } = project;

  const whenDidUpdate = when(lastUpdated);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="project" title={name} style={style}>
      <span className="project__info project__info--name">{name}</span>
      <span className="project__info project__info--date">
        <span className="text--little">last change: </span> <br />
        {whenDidUpdate}
      </span>
      <Button
        submit={false}
        className="project__button"
        onClick={() => open(id)}
        text="Open"
        theme="main"
        title={`Open ${name}`}
      />
      <Button
        submit={false}
        className="project__button"
        onClick={() => remove(id)}
        text="Delete"
        theme="red"
        title={`Delete ${name}`}
      />
    </div>
  );
}
