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
  handleProjectName: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const PersonalSpaceView = ({
  userID,
  projects,
  handleSort,
  sortOptions,
  handleProjectName,
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
        </form>
      </div>
      {projects.map((project) => (
        <div key={project.id} className="PersonalSpace">
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
                  <div>
                    <p className="project-shared-sign">Is Project Shared?</p>
                    <p>{project.shared.toString()}</p>
                  </div>
                  <div>
                    <p className="project-param-sign">Another param?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default PersonalSpaceView;
