import React from 'react';

import { SiTypescript } from 'react-icons/si';
import { extractExtension } from '../../../utils/file-extension';
import { NodeState } from '../../../utils/file-tree-node';

interface FileIconProps {
  nodeData: NodeState;
}

export default function FileIcon({ nodeData }: FileIconProps): JSX.Element {
  const fileExtension = extractExtension(nodeData.name);

  const handleClick = () => {
    console.log({ fileExtension, ...nodeData });
  };

  return <SiTypescript onClick={handleClick} />;
}
