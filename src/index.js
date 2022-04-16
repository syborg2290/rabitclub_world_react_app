import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    {/* <Beforeunload
      onBeforeunload={async (event) => {
        event.preventDefault();
      }}
    > */}
    <App />
    {/* </Beforeunload> */}
  </React.StrictMode>,
  document.getElementById("root")
);
