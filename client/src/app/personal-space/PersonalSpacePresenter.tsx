import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import Message from '../../data/model/message';
import IdeModel, { ProjectData } from '../../data/model/model';
import toastPromise from '../../utils/toast';
import PromiseNoData from '../components/promise-no-data/PromiseNoData';
import ControlArea, { SortOption } from './PersonalSpaceControlArea';
import ProjectsArea from './PersonalSpaceProjectArea';

interface PersonalSpacePresenterProp {
  model: IdeModel;
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

const sortProjects = (sortingOption: SortOption, projs) => {
  const sortedProjects: ProjectData[] = projs.sort((project1, project2) => {
    switch (sortingOption) {
      case SortOption.DATE:
        return project1.lastUpdated < project2.lastUpdated ? 1 : -1;
      case SortOption.NAME:
        return project1.name > project2.name ? 1 : -1;
      default:
        return 1;
    }
  });
  return sortedProjects;
};

export default function PersonalSpacePresenter({
  model,
}: PersonalSpacePresenterProp): JSX.Element {
  const currSortOption = useRef(SortOption.DATE);
  const [projects, setProjects] = useState<ProjectData[] | null>(null);
  const [state, setState] = useState(0);

  const forceRerender = () => setState(state + 1);
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
      heightAuto: false,
      inputValidator: (value) => !value && 'A value must be provided!',
    } as SweetAlertOptions;

    return Swal.fire(options);
  };

  function updateProjectState(project: ProjectData[]): void {
    setProjects(sortProjects(currSortOption.current, [...project]));
  }

  useEffect(() => {
    if (!model.isLoggedIn) history.push({ pathname: '/login' });
    if (model.persisted) model.setPersisted(false);

    const projectObserver = (m: Message) => {
      if (m === Message.PROJECTS_CHANGE)
        updateProjectState(model.getProjects());
    };
    model.addObserver(projectObserver);

    return () => model.removeObserver(projectObserver);
  }, []);

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = event.target.value as SortOption;
    const sortedProjects = sortProjects(sortOption, projects);
    currSortOption.current = sortOption;
    setProjects([...sortedProjects]);
  };

  const createProject = async () => {
    const swalFireInput: SwalFireInput = {
      title: 'Enter your project name',
      input: 'text',
      inputLabel: 'Your project name',
      preConfirm: (name) => {
        const creationDate = Date.now();
        const promise = model.createProject(name, creationDate);

        const msgs = {
          loading: 'Creating project...',
          error: 'Could not create project. Please try again',
          success: 'Project successfully created',
        };

        toastPromise(promise, msgs);
      },
    };
    swalFirePopUp(swalFireInput);
  };

  const openProject = (projectID: string) => {
    const promise = model.openProject(projectID).then(() => {
      history.push({
        pathname: '/code',
      });
    });
    const msgs = {
      loading: 'Opening project...',
      error: 'Could not open project. Please try again',
      success: 'Enjoy your work',
    };
    toastPromise(promise, msgs);
  };

  const deleteProject = async (projectID: string) => {
    const swalFireInput: SwalFireInput = {
      title: 'Are you sure you want to delete this project?',
      input: '',
      inputLabel: '',
      preConfirm: () => {},
    };
    swalFirePopUp(swalFireInput).then((result) => {
      if (result.isConfirmed) {
        const promise = model.deleteProject(projectID);
        const msgs = {
          loading: 'Deleting project...',
          success: 'Project successfully deleted',
          error: 'Could not delete project. Please try again.',
        };

        toastPromise(promise, msgs);
      }
    });
  };

  const joinCollab = async () => {
    const swalFireInput: SwalFireInput = {
      title: 'Enter room ID',
      input: 'text',
      inputLabel: 'Room ID',
      preConfirm: (roomID) => {
        const promise = model.getCollabProject(roomID).then(() =>
          history.push({
            pathname: '/code',
          })
        );

        const msgs = {
          loading: 'Joining session...',
          error: 'Could not join session. Please try again',
          success: 'Session joined successfully',
        };

        toastPromise(promise, msgs);
      },
    };
    swalFirePopUp(swalFireInput);
  };

  const logout = () => {
    model.logout();
    history.push({
      pathname: '/login',
    });
  };

  return (
    <div className="container container--personal-space">
      <ControlArea
        logout={logout}
        altSort={
          currSortOption.current === SortOption.DATE
            ? SortOption.NAME
            : SortOption.DATE
        }
        currSort={currSortOption.current}
        name={model.name}
        handleSort={handleSort}
        joinCollab={joinCollab}
        createProject={createProject}
      />
      {projects ? (
        <ProjectsArea
          projects={projects}
          openProject={openProject}
          deleteProject={deleteProject}
        />
      ) : (
        <PromiseNoData
          promise={model.getAllUserProjects()}
          loadingMessage="Loading your Projects"
          errorMessage="Failed to load your projects"
          tryAgain={forceRerender}
          classNameBlck="personal-space"
        />
      )}
    </div>
  );
}
