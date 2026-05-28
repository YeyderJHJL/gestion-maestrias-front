import "./index.css";
import React from "react";
import { render } from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { App } from "./App";

render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);