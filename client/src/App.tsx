// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import IdeModel from './data/model/model';
// import LoginPresenter from './app/login/LoginPresenter';

// function App(): JSX.Element {
//   const ideModel = new IdeModel();
//   return (
//     <Router>
//       <div className="container">
//         <Route
//           path="/login"
//           exact
//           component={() => <LoginPresenter model={ideModel} />}
//         />
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { FC } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SidebarHelper from './app/sidebar/SidebarHelper';
import {
  Settings,
  History,
  OutFile,
  Overview,
  File2,
  File1,
} from './app/sidebar/pages/Overview';

const App: FC = () => {
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

export default App;
