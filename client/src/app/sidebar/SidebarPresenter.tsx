import React, { useState, useEffect } from 'react';
import '../../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Swal from 'sweetalert2';
import SidebarView from './SidebarView';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';

interface FilesData {
  name: string;
  id: string;
}

interface SideBarprops {
  model: IdeModel;
}

export default function Sidebar({ model }: SideBarprops): JSX.Element {
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

  return <SidebarView projectID={projectID} files={files} />;
}
