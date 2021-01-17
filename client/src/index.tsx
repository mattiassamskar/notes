import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { TabProvider } from "./TabContext";
import { NoteProvider } from "./NoteContext";
import { AuthProvider } from "./AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <TabProvider>
        <NoteProvider>
          <App />
        </NoteProvider>
      </TabProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();