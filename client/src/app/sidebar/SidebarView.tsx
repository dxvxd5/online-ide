import React from 'react';
import FolderTree from 'react-folder-tree';
import { TreeChangeEvent } from '../../data/model/model';
import { NodeState } from '../../utils/file-tree-node';
import EditIcon from '../components/icons/edit/EditIcon';
import DeleteIcon from '../components/icons/delete/DeleteIcon';
import IconProps from '../components/icons/type';

export interface OnNameClickArgs {
  nodeData: NodeState;
  defaultOnClick: () => void;
}

interface SidebarViewProps {
  fileTreeState: NodeState;
  FileIconComponent: (_: IconProps) => JSX.Element;
  onFileNameClick: (_: OnNameClickArgs) => void;
  onFileTreeChange: (_: NodeState, __: TreeChangeEvent) => void;
}

export default function SidebarView({
  fileTreeState,
  FileIconComponent: FileIcon,
  onFileNameClick,
  onFileTreeChange,
}: SidebarViewProps): JSX.Element {
  return (
    <FolderTree
      data={fileTreeState}
      showCheckbox={false}
      iconComponents={{
        FileIcon,
        EditIcon,
        DeleteIcon,
      }}
      onNameClick={onFileNameClick}
      onChange={onFileTreeChange}
    />
  );
}
