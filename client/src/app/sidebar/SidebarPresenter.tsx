import React, { useState, useEffect } from 'react';
import SidebarView from './SidebarView';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';
import FileTreeGenerator from '../../utils/file-tree-generator';

interface SidebarPresenterProps {
  model: IdeModel;
}

export default function SidebarPresenter({
  model,
}: SidebarPresenterProps): JSX.Element {
  const [files, setFiles] = useState(model.currentProject.files);

  useEffect(() => {
    function projectListener(m: Message) {
      if (m === Message.CURRENT_PROJECT_CHANGE) {
        setFiles(model.currentProject.files);
      }
    }
    model.addObserver(projectListener);
    return () => model.removeObserver(projectListener);
  }, []);

  const rootFolderName = model.currentProject.name;
  const fileTreeState = FileTreeGenerator.generateFileTree(
    rootFolderName,
    files
  ).toState();

  return <SidebarView fileTreeState={fileTreeState} />;
}
