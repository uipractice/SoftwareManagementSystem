import React from 'react'
import Login from './components/login/Login'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'


function App() {
  return (
    <div className="App">
       <Router>
            <Switch>
                <Route exact path="/"> <Login/> </Route>
                <Route path="/admin"> <AdminDashboard/> </Route>   
            </Switch>          
        </Router>
    </div>
  );
}

export default App;
