// Trigger build for Vercel env variables
import React from "react";

import { createRoot } from "react-dom/client";
import App from "./App";
import { ReaderThemeProvider } from "./context/ReaderThemeContext";

import "./styles/index.css";

console.log("VITE_API_URL is currently:", import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")).render(

  <ReaderThemeProvider>
    <App />
  </ReaderThemeProvider>
);
