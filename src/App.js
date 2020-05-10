import React, { Component } from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import VideoList from "./views/videoList";
import VideoPlay from "./views/videoPlay";

class App extends Component {
  render() {
    return (
        <Switch>
          <Route path="/video/list" component={VideoList}/>
          <Route path="/video/play/:id" component={VideoPlay}/>
          <Redirect to="/video/list"/>
        </Switch>
    );
  }
}

export default App;
