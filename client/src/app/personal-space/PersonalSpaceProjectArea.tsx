import React from 'react';

import { ProjectData } from '../../data/model/model';
import Empty from '../components/empty/Empty';
import Project from '../components/project/Project';

interface ProjectsViewProps {
  projects: ProjectData[];
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
}

export default function ProjectsArea({
  projects,
  openProject,
  deleteProject,
}: ProjectsViewProps): JSX.Element {
  return (
    <>
      {projects.length ? (
        <div className="container--project">
          {projects.map((project, i) => (
            <Project
              project={project}
              key={project.id}
              remove={deleteProject}
              open={openProject}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <Empty
          message="You do not have any projects"
          className="empty--project"
        />
      )}
    </>
  );
}
