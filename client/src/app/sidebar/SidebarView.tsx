import React from 'react';
import FolderTree from 'react-folder-tree';
import FileIcon from '../components/file-icon/FileIcon';
import { NodeState } from '../../utils/file-tree-node';

interface SidebarViewProps {
  fileTreeState: NodeState;
}

interface ReactFolderTreeClickEvent {
  nodeData: NodeState;
  defaultOnClick: () => void;
}

export default function SidebarView({
  fileTreeState,
}: SidebarViewProps): JSX.Element {
  return (
    <FolderTree
      data={fileTreeState}
      showCheckbox={false}
      iconComponents={{
        FileIcon,
      }}
      onNameClick={({
        nodeData,
        defaultOnClick,
      }: ReactFolderTreeClickEvent) => {
        defaultOnClick();
        console.log({ nodeData });
      }}
      onChange={(e: unknown) => console.log(e)}
    />
  );
}
