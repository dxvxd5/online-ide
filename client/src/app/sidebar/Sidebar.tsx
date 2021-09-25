import React, { FC } from 'react';
import '../../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SidebarHelper from './SidebarHelper';
import {
  Settings,
  History,
  OutFile,
  Overview,
  File2,
  File1,
} from './pages/Overview';

const Sidebar: FC = () => {
  return (
    <Router>
      <SidebarHelper />
      <Switch>
        <Route path="/main" component={Overview} exact />
        <Route path="/folder/file1" component={File1} exact />
        <Route path="/folder/file1" component={File2} exact />
        <Route path="/out_file" component={OutFile} exact />
        <Route path="/history" component={History} exact />
        <Route path="/settings" component={Settings} exact />
      </Switch>
    </Router>
  );
};

export default Sidebar;
