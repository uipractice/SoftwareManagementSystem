import React from 'react';
import Login from './app/components/login/Login';
import { HashRouter as Router, Route, Switch,Redirect } from 'react-router-dom';
import AdminDashboard from './app/components/admin/AdminDashboard';
import UserDetailsDashboard from './app/components/admin/UserManagement/UserDetailsDashboard'
import { getAuthToken } from './app/components/utils/authToken';
const PrivateRoute=({component:Component, ...rest})=>{
  const isAuthenticated=getAuthToken()?true:false;
return(
  <Route {...rest} render={(props) => (
    isAuthenticated
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)
}
function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <PrivateRoute path='/admin' component={AdminDashboard}/>
        <PrivateRoute path='/user-details' component={UserDetailsDashboard}/>
       
      </Switch>
    </Router>
  );
}

export default Routes;
