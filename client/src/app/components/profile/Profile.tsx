import React from 'react';
import getInitials from '../../../utils/profile-pic';
import '../../../assets/styles/header.css';

interface ProfileProps {
  name: string;
  color: string;
  displayName: boolean;
}

export default function Profile({
  name,
  color,
  displayName,
}: ProfileProps): JSX.Element {
  const initials = getInitials(name);

  return (
    <div className="header__profile">
      <span className="header__profile-pic" style={{ backgroundColor: color }}>
        {initials}
      </span>
      {displayName ? <span className="header__name">{name}</span> : null}
    </div>
  );
}
