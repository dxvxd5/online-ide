import React from 'react';
import { FileData } from '../../../../data/model/model';
import IconProps from '../type';
import LanguageIcon from './LanguageIcon';

interface FileIconProps {
  onClick: (file: FileData) => void;
}

export default function FileIcon({ onClick }: FileIconProps) {
  return function Icon({
    nodeData,
    onClick: defaultOnClick,
  }: IconProps): JSX.Element {
    const handleClick = () => {
      const { fileID, name } = nodeData;
      if (fileID) onClick({ id: fileID, name });
      defaultOnClick();
    };
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        className="sidebar__icon"
      >
        {LanguageIcon(nodeData.name)}
      </span>
    );
  };
}
