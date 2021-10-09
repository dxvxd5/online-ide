import React, { useState, useEffect } from 'react';
import SidebarView from './SidebarView';
import Message from '../../data/model/message';
import IdeModel, { FileData, TreeChangeEvent } from '../../data/model/model';
import FileIcon from '../components/icons/file/FileIcon';
import { NodeState } from '../../utils/file-tree-node';

interface SidebarPresenterProps {
  model: IdeModel;
  onFileTreeChange: (t: NodeState, e: TreeChangeEvent) => void;
  stopFollowing: () => void;
}

export interface OnNameClickArgs {
  nodeData: NodeState;
  defaultOnClick: () => void;
}

export default function SidebarPresenter({
  model,
  onFileTreeChange,
  stopFollowing,
}: SidebarPresenterProps): JSX.Element {
  const [files, setFiles] = useState(model.currentFileTree);

  useEffect(() => {
    function projectListener(m: Message) {
      if (m === Message.CURRENT_PROJECT) {
        setFiles(model.currentFileTree);
      }
      if (m === Message.UPDATE_TREE) {
        setFiles(model.currentFileTree);
      }
    }
    model.addObserver(projectListener);
    return () => model.removeObserver(projectListener);
  }, []);

  const onFileIconClick = (file: FileData) => {
    stopFollowing();
    model.setFocusedFile(file);
    model.addTabFile(file);
  };

  const onFileNameClick = ({ defaultOnClick, nodeData }: OnNameClickArgs) => {
    if (nodeData.fileID) {
      stopFollowing();
      const clickedFile = { id: nodeData.fileID, name: nodeData.name };

      model.setFocusedFile(clickedFile);
      model.addTabFile(clickedFile);
    }
    defaultOnClick();
  };

  const FileIconComponent = FileIcon({ onClick: onFileIconClick });

  return (
    <SidebarView
      fileTreeState={files}
      onFileNameClick={onFileNameClick}
      FileIconComponent={FileIconComponent}
      onFileTreeChange={onFileTreeChange}
    />
  );
}
