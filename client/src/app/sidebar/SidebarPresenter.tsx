import React, { useState, useEffect } from 'react';
import SidebarView from './SidebarView';
import Message from '../../data/model/message';
import IdeModel, { FileData, TreeChangeEvent } from '../../data/model/model';
import FileIcon from '../components/icons/file/FileIcon';
import { NodeState } from '../../utils/file-tree-node';

interface SidebarPresenterProps {
  model: IdeModel;
}

export interface OnNameClickArgs {
  nodeData: NodeState;
  defaultOnClick: () => void;
}

export default function SidebarPresenter({
  model,
}: SidebarPresenterProps): JSX.Element {
  const [files, setFiles] = useState(model.currentFileTree);

  useEffect(() => {
    function projectListener(m: Message) {
      if (m === Message.CURRENT_PROJECT_CHANGE) {
        setFiles(model.currentFileTree);
      }
      if (m === Message.CURRENT_PROJECT) {
        setFiles(model.currentFileTree);
      }
    }
    model.addObserver(projectListener);
    return () => model.removeObserver(projectListener);
  }, []);

  const updateFocusedFile = (file: FileData): void => {
    if (file.id === model.focusedFile?.id) return;
    model.setFocusedFile(file);
  };

  const onFileIconClick = (file: FileData) => {
    updateFocusedFile(file);
  };

  const onFileNameClick = ({ defaultOnClick, nodeData }: OnNameClickArgs) => {
    if (nodeData.fileID) {
      const clickedFile = { id: nodeData.fileID, name: nodeData.name };

      updateFocusedFile(clickedFile);
      model.addTabFile(clickedFile);
    }
    defaultOnClick();
  };

  const FileIconComponent = FileIcon({ onClick: onFileIconClick });

  const onFileTreeChange = (t: NodeState, e: TreeChangeEvent) => {
    model.applyFileTreeChange(t, e);
  };

  return (
    <SidebarView
      fileTreeState={files}
      onFileNameClick={onFileNameClick}
      FileIconComponent={FileIconComponent}
      onFileTreeChange={onFileTreeChange}
    />
  );
}
