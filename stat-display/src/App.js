import './App.css';
import React, { useState } from "react";
import info2021 from "./LeagueInfo/info-2021.json";
import info2022 from "./LeagueInfo/info-2022.json";
import info2023 from "./LeagueInfo/info-2023.json";

import BottomNav from "./components/BottomNav/BottomNav";
import { Pages } from './util';

import { Home } from './views/Home';
import { Schedule } from './views/Schedule';
import { Week } from './views/Week';
import { Analysis } from './views/Analysis';

function App() {
  const [currentPage, setPage] = useState(Pages.Home);
  const [matchUp, setActiveMatchup] = useState(null);
  const [info, setInfo] = useState(info2023);
  
  const updatePage = (newPage) => {
    setPage(newPage);
    setActiveMatchup(null);
  }

  const triggerMatchup = (gameId) => {
    setActiveMatchup(gameId);
  }

  const changeYear = (year) => {    
    switch (year) {
      case "2021":
        setInfo(info2021);
        return;
      case "2022":
        setInfo(info2022);
        return;
      case "2023":
      default:
        setInfo(info2023);
        return;
    }
  }

  const renderPage = () => {
    if (matchUp) {
      return <Week 
        info = {info}
        matchUp = {matchUp}
        triggerMatchup={triggerMatchup}
      />
    }
    switch(currentPage) {
      case Pages.Home:
        return <Home info = {info} triggerMatchup={triggerMatchup}/>;
      case Pages.Schedule:
        return <Schedule info = {info} triggerMatchup={triggerMatchup}/>;
      case Pages.Analysis:
        return <Analysis info = {info}/>;
      default:
        return <span/>
    }    
  }
  
  return (
    <>
      {renderPage()}
      <BottomNav 
        currentPage={matchUp ? null : currentPage}
        onPageClick = {updatePage} 
        onYearChange = {changeYear}
      />
    </>
      
  );
}

export default App;