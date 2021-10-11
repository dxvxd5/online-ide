import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';
import ProjectError from '../components/error/ProjectError';
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

type SwalFireType = {
  (input: string): void;
};
interface SwalFireInput {
  title: string;
  input: string;
  inputLabel: string;
  preConfirm: SwalFireType;
}

export default function PersonalSpacePresenter({
  model,
}: PersonalSpacePresenterProp): JSX.Element {
  const userID = model.getUserID();
  const [projects, setProjects] = useState(model.getProjects());
  const [projectError, setProjectError] = useState(false);
  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [projectErrorInfo, setProjectErrorInfo] = useState('');
  const sortOptions = ['Last Updated', 'Name'];
  const history = useHistory();

  const swalFirePopUp = (
    swalFireInput: SwalFireInput
  ): Promise<SweetAlertResult> => {
    const options = {
      ...swalFireInput,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      backdrop: true,
    } as SweetAlertOptions;
    return Swal.fire(options);
  };

  useEffect(() => {
    const projectObserver = (m: Message) => {
      if (m === Message.PROJECTS_CHANGE)
        setProjects([...model.getProjects()] as ProjectsData[]);
    };
    model.addObserver(projectObserver);

    return () => model.removeObserver(projectObserver);
  }, []);

  const handleSortedProjects = (sortProjectsValue: string) => {
    const sortedProjects: ProjectsData[] = projects.sort(
      (project1, project2) => {
        const isLastUpdated = sortProjectsValue === 'Last Updated';
        const isName = sortProjectsValue === 'Name';

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

  const handleProjectName = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const swalFireInput: SwalFireInput = {
      title: 'Enter your project name',
      input: 'text',
      inputLabel: 'Your project name',
      preConfirm: (name) => {
        const creationDate = Date.now();
        model
          .createProject(name, creationDate)
          .then(() => name)
          .catch(() =>
            Swal.fire(
              `Error. Could not create a project. Please try again.`,
              '',
              'error'
            )
          );
      },
    };
    swalFirePopUp(swalFireInput).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`Your project name is ${result.value}`, '', 'success');
      }
    });
  };

  const openProject = async (projectID: string) => {
    try {
      await model.openProject(projectID);
      setIsProjectLoaded(true);
      if (projectError) setProjectError(false);
    } catch {
      setProjectErrorInfo('Could not open the project. Please try again.');
      setProjectError(true);
    }
  };

  const deleteProject = async (projectID: string) => {
    const swalFireInput: SwalFireInput = {
      title: 'Are you sure you want to delete this project?',
      input: '',
      inputLabel: '',
      preConfirm: () => {},
    };
    swalFirePopUp(swalFireInput)
      .then((result) => {
        if (result.isConfirmed) {
          model.deleteProject(projectID);
          if (projectError) setProjectError(false);
        }
      })
      .catch(() => {
        setProjectErrorInfo('Could not delete the project. Please try again.');
        setProjectError(true);
      });
  };

  const joinCollabProject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const swalFireInput: SwalFireInput = {
      title: 'Enter room ID',
      input: 'text',
      inputLabel: 'Room ID',
      preConfirm: (roomID) => {
        model
          .getCollabProject(roomID)
          .then(() => setIsProjectLoaded(true))
          .catch(() =>
            Swal.fire(
              `Error. Could not join a project. Please try again.`,
              '',
              'error'
            )
          );
      },
    };
    swalFirePopUp(swalFireInput);
  };

  if (projectError)
    return (
      <ProjectError
        projectErrorInfo={projectErrorInfo}
        tryAgain={() => setProjectError(false)}
      />
    );

  if (isProjectLoaded) {
    history.push({
      pathname: '/code',
    });
  }

  return (
    <PersonalSpaceView
      deleteProject={deleteProject}
      joinCollabProject={joinCollabProject}
      handleProjectName={handleProjectName}
      handleSort={handleSort}
      projects={projects}
      userID={userID}
      sortOptions={sortOptions}
      openProject={openProject}
    />
  );
}
