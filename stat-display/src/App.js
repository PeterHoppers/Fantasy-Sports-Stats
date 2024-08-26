import './App.css';
import React, { useState, useEffect } from "react";
import info2021 from "./LeagueInfo/info-2021.json";
import info2022 from "./LeagueInfo/info-2022.json";
import info2023 from './LeagueInfo/info-2023.json';

import BottomNav from "./components/BottomNav/BottomNav";
import LoadingMessage from './components/LoadingMessage/LoadingMessage';
import { Pages } from './definitions.js';

import { Home } from './views/Home/Home.js';
import { Schedule } from './views/Schedule/Schedule.js';
import { Week } from './views/Week/Week.js';
import { Analysis } from './views/Analysis/Analysis.js';

import {getCurrentInformation} from './api/api.js';
import { Draft } from './views/Draft/Draft.js';
import { Transactions } from './views/Transaction/Transaction.js';

function App() {
  const defaultYears = [2021, 2022, 2023, 2024];
  const currentYear = defaultYears[defaultYears.length - 1];

  const [currentPage, setPage] = useState(Pages.Home);
  const [matchUp, setActiveMatchup] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [info, setInfo] = useState(info2023);
  const [years, setYears] = useState(defaultYears);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    getCurrentInformation(currentYear).then((apiInfo) => {
      if (apiInfo.errorMessage !== null || apiInfo.teams.length === 0) {
        console.warn(`Failed to get API call for ${currentYear}. Displaying only local information.`);
        const possibleYears = defaultYears.slice(0, -1);
        setYears(possibleYears);
        setSelectedYear(possibleYears[possibleYears.length - 1]);
        setCurrentInfo({});
      } else {        
        setYears(defaultYears);
        setSelectedYear(defaultYears[defaultYears.length - 1]);
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
    setActiveMatchup(null);
    setSelectedYear(year);
    switch (year) {
      case "2021":
        setInfo(info2021);
        return;
      case "2022":
        setInfo(info2022);
        return;
      case "2023":
        setInfo(info2023);
        return;
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
      case Pages.Draft:
        return <Draft info = {info} year = {selectedYear}/>;
      case Pages.Transactions:
        return <Transactions info = {info}/>;
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
