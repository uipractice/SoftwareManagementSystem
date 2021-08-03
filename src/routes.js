import React from 'react';
import Login from './app/components/login/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboard from './app/components/admin/Dashboard';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Route path='/admin'>
          <AdminDashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;
