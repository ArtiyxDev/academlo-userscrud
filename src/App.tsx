import { useEffect } from "react";
import "./App.css";
import { Header } from "./components";
import { initTheme } from "./utils/toggleDarkTheme";

function App() {
  useEffect(() => {
    initTheme();
  }, []);
  return (
    <>
      <Header />
    </>
  );
}

export default App;
