/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Button from '../components/button/Button';
import Empty from '../components/empty/Empty';
import Logo from '../components/logo/Logo';
import Profile from '../components/profile/Profile';
import Project from '../components/project/Project';

export enum SortOption {
  DATE = 'last change',
  NAME = 'name',
}

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
  altSort: SortOption;
  currSort: SortOption;
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
  altSort,
  currSort,
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
        <label className="text--little" htmlFor="sort-select">
          sort by...
        </label>
        <select
          value=""
          onChange={handleSort}
          className="select select--personal-space"
          id="sort-select"
        >
          <option value="">{currSort}</option>
          <option value={altSort}>{altSort}</option>
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
    </div>
  );
};
export default PersonalSpaceView;
