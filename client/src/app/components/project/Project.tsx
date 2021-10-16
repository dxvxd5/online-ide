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
    <div
      className="project"
      onClick={() => open(id)}
      role="button"
      tabIndex={0}
    >
      <div className="project__infos">
        <span className="project__name">{name}</span>
        <div className="project__date">
          <h6>Last updated:</h6>
          <h6>{whenDidUpdate}</h6>
        </div>
      </div>
      <Button
        submit={false}
        className="project__action project__action--delete"
        onClick={() => remove(id)}
        text="Delete"
        theme="red"
      />
    </div>
  );
}
