import React from 'react';
import './PersonalSpace.css';

interface ProjectsData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

interface PersonalSpaceViewProp {
  userID: string;
  projects: ProjectsData[];
  handleSort: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: string[];
  openProject: (id: string) => void;
  handleProjectName: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  joinCollabProject: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  deleteProject: (id: string) => void;
}

const PersonalSpaceView = ({
  userID,
  projects,
  handleSort,
  sortOptions,
  openProject,
  handleProjectName,
  joinCollabProject,
  deleteProject,
}: PersonalSpaceViewProp): JSX.Element => {
  return (
    <>
      <h1>This is Personal Space Overview</h1>
      <p>Your user id is: {userID}</p>
      <br />
      <h2>Projects:</h2>
      <div>
        <label htmlFor="id" className="space">
          <select id="selectTypeDish" value="" onChange={handleSort}>
            <option disabled hidden value="">
              Sort by...
            </option>
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <form>
          <button type="submit" onClick={(e) => handleProjectName(e)}>
            Create a new project
          </button>
          <button type="submit" onClick={(e) => joinCollabProject(e)}>
            Join a collab project
          </button>
        </form>
      </div>
      {projects.map((project) => (
        /* eslint-disable jsx-a11y/click-events-have-key-events */
        <>
          <div
            key={project.id}
            className="PersonalSpace"
            onClick={() => openProject(project.id)}
            role="button"
            tabIndex={0}
          >
            <div id="personal-space-overview">
              <div>
                <div className={`${'flex-between-projects'}`}>
                  <div className="project-info-wrapper">
                    <div className="project-name-wrapper">
                      <p className="project-name-sign">Project Name:</p>
                      <p style={{ color: '#ff8c00' }}>{project.name}</p>
                    </div>
                    <div>
                      <p className="project-last-updated-sign">Last updated:</p>
                      <p>{new Date(project.lastUpdated).toUTCString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="project-shared-sign">
            <button type="button" onClick={() => deleteProject(project.id)}>
              X
            </button>
          </div>
        </>
      ))}
    </>
  );
};
export default PersonalSpaceView;
