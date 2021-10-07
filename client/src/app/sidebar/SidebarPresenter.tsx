import React, { useState, useEffect } from 'react';
import SidebarView from './SidebarView';
import Message from '../../data/model/message';
import IdeModel, { FileData, TreeChangeEvent } from '../../data/model/model';
import FileIcon from '../components/icons/file/FileIcon';
import { NodeState } from '../../utils/file-tree-node';

interface SidebarPresenterProps {
  model: IdeModel;
  onFileTreeChange: (t: NodeState, e: TreeChangeEvent) => void;
}

export interface OnNameClickArgs {
  nodeData: NodeState;
  defaultOnClick: () => void;
}

export default function SidebarPresenter({
  model,
  onFileTreeChange,
}: SidebarPresenterProps): JSX.Element {
  const [files, setFiles] = useState(model.currentFileTree);

  useEffect(() => {
    function projectListener(m: Message) {
      if (m === Message.CURRENT_PROJECT) {
        setFiles(model.currentFileTree);
      }
      if (m === Message.UPDATE_TREE) {
        // console.log('UPDATE_TREE called');
        // console.log('model.currentFileTree: ', model.currentFileTree);
        setFiles(model.currentFileTree);
        // TODO: Need to stop the setFiles re-rendering
      }
    }
    model.addObserver(projectListener);
    return () => model.removeObserver(projectListener);
  }, []);

  const onFileIconClick = (file: FileData) => {
    model.setFocusedFile(file);
  };

  const onFileNameClick = ({ defaultOnClick, nodeData }: OnNameClickArgs) => {
    if (nodeData.fileID) {
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
