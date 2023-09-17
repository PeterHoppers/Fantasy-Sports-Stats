import './App.css';
import React, { useState } from "react";
import info2023 from "./LeagueInfo/info-2023.json";

import BottomNav from "./components/BottomNav/BottomNav";
import { Pages } from './util';

import { Home } from './views/Home';
import { Schedule } from './views/Schedule';
import { Week } from './views/Week';

function App() {
  const [currentPage, setPage] = useState(Pages.Home);
  const [matchUp, setActiveMatchup] = useState(null);
  
  const updatePage = (newPage) => {
    setPage(newPage);
    setActiveMatchup(null);
  }

  const triggerMatchup = (gameId) => {
    setActiveMatchup(gameId);
  }

  const renderPage = () => {
    if (matchUp) {
      console.log("M<atchyp", matchUp);
      return <Week 
        info = {info2023}
        matchUp = {matchUp}
        triggerMatchup={triggerMatchup}
      />
    }
    switch(currentPage) {
      case Pages.Home:
        return <Home info = {info2023} triggerMatchup={triggerMatchup}/>;
      case Pages.Schedule:
        return <Schedule info = {info2023} triggerMatchup={triggerMatchup}/>;  
      default:
        return <span/>
    }    
  }
  
  return (
    <>
      {renderPage()}
      <BottomNav onPageClick = {updatePage} currentPage={currentPage}/>
    </>
      
  );
}

export default App;
