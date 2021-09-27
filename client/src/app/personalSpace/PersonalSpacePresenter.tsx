import React, { useEffect, useState } from 'react';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';
import PersonalSpaceView from './PersonalSpaceView';

interface PersonalSpacePresenterProp {
  model: IdeModel;
}

interface ProjectsData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

export default function PersonalSpacePresenter({
  model,
}: PersonalSpacePresenterProp): JSX.Element {
  const userID = model.getUserID();
  const [projects, setProjects] = useState(model.getProjects());

  useEffect(() => {
    const projectObserver = (m: Message) => {
      if (m === Message.PROJECTS_CHANGE)
        setProjects(model.getProjects() as ProjectsData[]);
    };
    model.addObserver(projectObserver);

    return () => model.removeObserver(projectObserver);
  }, []);

  const sortOptions = ['Shared', 'Last Updated', 'Name'];

  const handleSortedProjects = (sortProjectsValue: string) => {
    const sortedProjects: ProjectsData[] = projects.sort(
      (project1, project2) => {
        const isShared = sortProjectsValue === 'Shared';
        const isLastUpdated = sortProjectsValue === 'Last Updated';
        const isName = sortProjectsValue === 'Name';

        if (isShared) {
          const shared = Number(project2.shared) - Number(project1.shared);
          return shared;
        }
        if (isLastUpdated) {
          const dateA = new Date(project1.lastUpdated).getTime();
          const dateB = new Date(project2.lastUpdated).getTime();
          const lastupdated = dateA < dateB ? 1 : -1;
          return lastupdated;
        }
        if (isName) {
          const name = project1.name > project2.name ? 1 : -1;
          return name;
        }
        return 0;
      }
    );
    setProjects([...sortedProjects]);
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSortedProjects(event.target.value);
  };

  return (
    <PersonalSpaceView
      handleSort={handleSort}
      projects={projects}
      userID={userID}
      sortOptions={sortOptions}
    />
  );
}
