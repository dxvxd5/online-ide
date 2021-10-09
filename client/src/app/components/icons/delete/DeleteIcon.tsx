import React from 'react';
import { AiFillDelete } from 'react-icons/ai';

import IconProps from '../type';

const DeleteIcon = ({
  onClick: defaultOnClick,
  nodeData,
}: IconProps): JSX.Element | null => {
  const { isRoot } = nodeData;

  // if this node is editable, render an EditIcon, otherwise render air
  return isRoot ? null : <AiFillDelete onClick={defaultOnClick} />;
};

export default DeleteIcon;
