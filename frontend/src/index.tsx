import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AppWrapper } from "./components/common/PageMeta";

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AppWrapper>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppWrapper>
  </React.StrictMode>
);