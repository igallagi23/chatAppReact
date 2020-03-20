import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route,Switch} from "react-router-dom";
import Join from "./Components/Join";
import Chat from "./Components/Chat";
import NotFound from "./Components/NotFound";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Join}/>
                <Route path="/chat" exact component={Chat}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        </Router>
    );
}

export default App;
