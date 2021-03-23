import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Drive  from './views/drive.js';
import Editor from './views/editor.js';

import './style.scss';

ReactDOM.render(
  <React.StrictMode>

  <Router>
    <Switch>
      <Route component={Editor} exact path="/:filename"/>
      <Route component={Editor} path="/"/>
    </Switch>
  </Router>

  </React.StrictMode>,
  document.getElementById('root')
);