import React from 'react';
import { GrEdit } from 'react-icons/gr';

import IconProps from '../type';

const EditIcon = ({
  onClick: defaultOnClick,
  nodeData,
}: IconProps): JSX.Element | null => {
  const { isRoot } = nodeData;

  // if this node is editable, render an EditIcon, otherwise render air
  return isRoot ? null : <GrEdit onClick={defaultOnClick} />;
};

export default EditIcon;
