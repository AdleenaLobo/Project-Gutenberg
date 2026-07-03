import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ReaderThemeProvider } from "./context/ReaderThemeContext";

import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <ReaderThemeProvider>
    <App />
  </ReaderThemeProvider>
);
