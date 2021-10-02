import React, { useState, useEffect } from 'react';
import '../../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Swal from 'sweetalert2';
import SidebarHelper from './SidebarHelper';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';

interface FilesData {
  name: string;
  id: string;
}

interface SidebarItem {
  projectsData: {
    id: string;
    name: string;
  };
  filesData: FilesData;
  iconOpened?: any;
  iconClosed?: any;
  subnav?: SidebarItem[];
}

interface SideBarprops {
  model: IdeModel;
}

export default function Sidebar({ model }: SideBarprops): JSX.Element {
  const projectID = model.getProjectID();
  const [files, setFiles] = useState(model.getAllFilesOfProject());
  useEffect(() => {
    const fileObserver = (m: Message) => {
      if (m === Message.FILES_CHANGE)
        setFiles([...model.getAllFilesOfProject()] as FilesData[]);
    };
    model.addObserver(fileObserver);
    return () => model.removeObserver(fileObserver);
  }, []);
  const handleFileName = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    Swal.fire({
      title: 'Enter your File name',
      input: 'text',
      inputLabel: 'Your file name',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        const creationDate = Date.now();
        model
          .createFile(name, creationDate)
          .then(() => name)
          .catch(() =>
            Swal.fire(
              `Error. Could not create a project. Please try again.`,
              '',
              'error'
            )
          );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`Your project name is ${result.value}`, '', 'success');
      }
    });
  };
  return <SidebarHelper projectID={projectID} files={files} />;
}

// const Sidebar: FC = () => {
//   const ideModel = new IdeModel();
//   return (
//     <Router>
//       <SidebarHelper model={ideModel} />
//       <Switch>
//         <Route path="/main" component={Overview} exact />
//         <Route path="/folder/file1" component={File1} exact />
//         <Route path="/folder/file1" component={File2} exact />
//         <Route path="/out_file" component={OutFile} exact />
//         <Route path="/history" component={History} exact />
//         <Route path="/settings" component={Settings} exact />
//       </Switch>
//     </Router>
//   );
// };

// export default Sidebar;
