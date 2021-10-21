import React from 'react';
import { FcFolder } from 'react-icons/fc';
import { NodeState } from '../../../../utils/file-tree-node';

export interface IconProps {
  nodeData: NodeState;
  onClick: () => void;
}

export default function FolderIcon({
  onClick: defaultOnClick,
}: IconProps): JSX.Element {
  const handleClick = () => {
    defaultOnClick();
  };
  return <FcFolder onClick={handleClick} />;
}
