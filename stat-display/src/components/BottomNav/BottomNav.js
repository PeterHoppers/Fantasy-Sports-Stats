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
        </footer>
    );
}

export default BottomNav;