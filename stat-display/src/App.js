import logo from './logo.svg';
import './App.css';
import React from "react";
import info2023 from "./LeagueInfo/info-2023.json";

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span>{JSON.stringify(info2023)}</span>

      </header>
    </div>
  );
}

export default App;
