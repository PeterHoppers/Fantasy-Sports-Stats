import React from "react";
import './BottomNav.scss';

import { Pages } from './../../util';

const BottomNav = (props) => {
    return (
        <footer className="bottom-nav">
            <div className={"bottom-nav__link-holder" + ((props.currentPage === Pages.Home) ? " active-link" : "")} onClick={() => props.onPageClick(Pages.Home)}>
                <span className="bottom-nav__link">Scoreboard</span>
            </div> 
            <div className={"bottom-nav__link-holder" + ((props.currentPage === Pages.Schedule) ? " active-link" : "")}  onClick={() => props.onPageClick(Pages.Schedule)}>
                <span className="bottom-nav__link">Schedule</span>
            </div>
            <div className={"bottom-nav__link-holder" + ((props.currentPage === Pages.Analysis) ? " active-link" : "")}  onClick={() => props.onPageClick(Pages.Analysis)}>
                <span className="bottom-nav__link">Analysis</span>
            </div>
            <div className="bottom-nav__year-select">
                <label htmlFor="year-select">Year:</label>
                <select onChange={(event) => props.onYearChange(event.target.value)}defaultValue="2023" name="year" id="year-select">
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
            </div>            
        </footer>
    );
}

export default BottomNav;