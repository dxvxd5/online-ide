import React from 'react';
import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';
import Profile from '../components/profile/Profile';
import Project from '../components/project/Project';
import EmptyState from './EmptyState';

interface ProjectsData {
  name: string;
  shared: boolean;
  id: string;
  lastUpdated: number;
}

interface PersonalSpaceViewProp {
  name: string;
  projects: ProjectsData[];
  handleSort: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: string[];
  openProject: (id: string) => void;
  createProject: () => void;
  joinCollab: () => void;
  deleteProject: (id: string) => void;
  logout: () => void;
}

const PersonalSpaceView = ({
  name,
  projects,
  handleSort,
  sortOptions,
  openProject,
  createProject,
  joinCollab,
  deleteProject,
  logout,
}: PersonalSpaceViewProp): JSX.Element => {
  return (
    <div className="container container--personal-space">
      <header className="header header--personal-space">
        <Profile name={name} color="#341a58" />
        <Logo />
        <Button
          text="log out"
          theme="red"
          submit={false}
          onClick={logout}
          className="header__button header__button--logout"
        />
      </header>
      <section className="section--personal-space">
        <h2 className="section__title--personal-space">Projects</h2>
        <select
          value=""
          onChange={handleSort}
          className="select select--personal-space"
        >
          <option disabled hidden value="">
            Sort by...
          </option>
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <Button
          text="Create project"
          submit={false}
          onClick={createProject}
          theme="main"
          className="section__button--personal-space"
        />
        <Button
          text="Join collaboration session"
          submit={false}
          onClick={joinCollab}
          theme="secondary"
          className="section__button--personal-space"
        />
      </section>
      {projects.length === 0 && <EmptyState />}
      <div className="container--project">
        {projects.map((project) => (
          <Project
            project={project}
            key={project.id}
            remove={deleteProject}
            open={openProject}
          />
        ))}
      </div>
    </div>
  );
};
export default PersonalSpaceView;
