import React, { Component } from "react";
import { Route } from "react-router-dom";
import UploadTxtFile from "./uploadFile/uploadFile.jsx";
import Dashboard from "./overallChat/overallChat.jsx";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={UploadTxtFile} />
        <Route exact path="/dashboard/:chatname" component={Dashboard} />
      </div>
    );
  }
}

export default App;
