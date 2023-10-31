import './App.css';
import React, { useState, useEffect } from "react";
import info2021 from "./LeagueInfo/info-2021.json";
import info2022 from "./LeagueInfo/info-2022.json";
import info2023 from "./LeagueInfo/info-2023.json";

import BottomNav from "./components/BottomNav/BottomNav";
import LoadingMessage from './components/LoadingMessage/LoadingMessage';
import { Pages } from './util';

import { Home } from './views/Home';
import { Schedule } from './views/Schedule';
import { Week } from './views/Week';
import { Analysis } from './views/Analysis';

import {getCurrentInformation} from './api/api.js';

function App() {
  const [currentPage, setPage] = useState(Pages.Home);
  const [matchUp, setActiveMatchup] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [info, setInfo] = useState(info2023);

  useEffect(() => {
    getCurrentInformation(2023).then((apiInfo) => {
      setCurrentInfo(apiInfo);
      setInfo(apiInfo);
    });    
  }, [])
  
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
        setInfo(currentInfo);
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
      {currentInfo === null &&
        <LoadingMessage message = {"Gathering updated information..."} />
      }
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
