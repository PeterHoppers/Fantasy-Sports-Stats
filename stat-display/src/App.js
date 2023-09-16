import './App.css';
import React, { useState } from "react";
import info2023 from "./LeagueInfo/info-2023.json";

import BottomNav from "./components/BottomNav/BottomNav";
import { Pages } from './util';

import { Home } from './views/Home';

function App() {
  const [currentPage, setPage] = useState(Pages.Home);
  
  const updatePage = (newPage) => {
    setPage(newPage);
  }

  const renderPage = () => {
    switch(currentPage) {
      case Pages.Home:
        return <Home info = {info2023}/>;    
      default:
        return <span/>
    }    
  }
  
  return (
    <>
      {renderPage()}
      <BottomNav onPageClick = {updatePage}/>
    </>
      
  );
}

export default App;
