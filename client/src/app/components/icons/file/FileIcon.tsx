import React from 'react';
import { SiTypescript } from 'react-icons/si';
import { FileData } from '../../../../data/model/model';
import IconProps from '../type';

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
    return <SiTypescript onClick={handleClick} />;
  };
}
