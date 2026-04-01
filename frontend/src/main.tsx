import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
const hasGoogleClientId =
  GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE" && GOOGLE_CLIENT_ID.trim().length > 0;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {hasGoogleClientId ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <HashRouter>
          <App />
        </HashRouter>
      </GoogleOAuthProvider>
    ) : (
      <HashRouter>
        <App />
      </HashRouter>
    )}
  </React.StrictMode>
);
