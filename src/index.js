import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Beforeunload } from "react-beforeunload";
import { setLoggedService, setOnlineService } from "./services/user";

ReactDOM.render(
  <React.StrictMode>
    <Beforeunload
      onBeforeunload={async (event) => {
        event.preventDefault();
        localStorage.setItem("logoutStatus", "true");
        await setOnlineService(false);
        await setLoggedService(false);
      }}
    >
      <App />
    </Beforeunload>
  </React.StrictMode>,
  document.getElementById("root")
);
