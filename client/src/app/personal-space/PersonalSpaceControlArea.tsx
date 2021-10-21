/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import Button from '../components/button/Button';
import Logo from '../components/logo/Logo';
import Profile from '../components/profile/Profile';

export enum SortOption {
  DATE = 'last change',
  NAME = 'name',
}

interface ControlAreaProps {
  name: string;
  handleSort: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  altSort: SortOption;
  currSort: SortOption;
  createProject: () => void;
  joinCollab: () => void;
  logout: () => void;
}

export default function ControlArea({
  name,
  handleSort,
  altSort,
  currSort,
  createProject,
  joinCollab,
  logout,
}: ControlAreaProps): JSX.Element {
  return (
    <>
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
    </>
  );
}
