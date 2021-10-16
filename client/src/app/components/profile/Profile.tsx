/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React from 'react';
import getInitials from '../../../utils/profile-pic';
import '../../../assets/styles/header.css';

interface ProfileProps {
  name: string;
  color: string;
  remove?: () => void;
  className?: string;
}

export default function Profile({
  name,
  color,
  remove,
  className,
}: ProfileProps): JSX.Element {
  const initials = getInitials(name);

  return (
    <div
      className={`header__profile ${className}`}
      style={{ backgroundColor: color }}
    >
      <span title={name} className="header__profile-pic">
        {initials}
      </span>
      {remove && (
        <span
          className="header__profile-del-cross"
          onClick={remove}
          role="button"
          tabIndex={0}
          title={`Remove ${name} from collaboration`}
        >
          x
        </span>
      )}
    </div>
  );
}
