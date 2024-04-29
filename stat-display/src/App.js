import './App.css';
import React, { useState, useEffect } from "react";
import info2021 from "./LeagueInfo/info-2021.json";
import info2022 from "./LeagueInfo/info-2022.json";

import BottomNav from "./components/BottomNav/BottomNav";
import LoadingMessage from './components/LoadingMessage/LoadingMessage';
import { Pages } from './util';

import { Home } from './views/Home';
import { Schedule } from './views/Schedule';
import { Week } from './views/Week';
import { Analysis } from './views/Analysis';

import {getCurrentInformation} from './api/api.js';

function App() {
  const defaultYears = [2021, 2022, 2023];

  const [currentPage, setPage] = useState(Pages.Home);
  const [matchUp, setActiveMatchup] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [info, setInfo] = useState(info2021);
  const [years, setYears] = useState(defaultYears)

  useEffect(() => {
    getCurrentInformation(2023).then((apiInfo) => {
      if (apiInfo.errorMessage !== null || apiInfo.teams.length === 0) {
        console.warn("Failed to get API call. Displaying only local information.");
        setYears(defaultYears.slice(0, -1));
        setCurrentInfo({});
      } else {
        setCurrentInfo(apiInfo);
        setInfo(apiInfo);
      }      
    });    
  }, [])
  
  const updatePage = (newPage) => {
    setPage(newPage);
    setActiveMatchup(null);
  }

  const triggerMatchup = (gameId) => {
    setActiveMatchup(gameId);
  }

  const clearMatchup = () => {
    setActiveMatchup(null);
  }

  const changeYear = (year) => {    
    switch (year) {
      case "2021":
        setInfo(info2021);
        setActiveMatchup(null);
        return;
      case "2022":
        setInfo(info2022);
        setActiveMatchup(null);
        return;
      case "2023":
      default:
        setInfo(currentInfo);
        setActiveMatchup(null);
        return;
    }
  }

  const renderPage = () => {
    if (matchUp) {
      return <Week 
        info = {info}
        matchUp = {matchUp}
        triggerMatchup={triggerMatchup}
        closeMatchup = {clearMatchup}
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
        years = {years}
      />
    </>
      
  );
}

export default App;
