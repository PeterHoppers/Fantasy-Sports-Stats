import React from "react";
import './BottomNav.scss';
import { HamburgerMenu } from "./HamburgerMenu";

import { Pages } from "../../definitions";

const BottomNav = (props) => {   
    return (
        <footer className="bottom-nav">
            <HamburgerMenu options={Object.keys(Pages)} currentPage={props.currentPage} onPageClick={props.onPageClick}/>
            {Object.keys(Pages).map(page => {
                return <div key={page} className={"bottom-nav__link-holder" + ((props.currentPage === page) ? " active-link" : "")} onClick={() => props.onPageClick(page)}>
                    <span className="bottom-nav__link">{page}</span>
                </div> 
            })}
            <div className="bottom-nav__year-select">
                <label htmlFor="year-select">Year:</label>
                <select onChange={(event) => props.onYearChange(event.target.value)} defaultValue={props.years[props.years.length - 1]} name="year" id="year-select" disabled={props.currentPage === Pages.Legacy}>
                    {props.years.map((year) => {
                        return <option key={year.toString()} value={year.toString()}>{year}</option>
                    })}                    
                </select>
            </div>            
        </footer>
    );
}

export default BottomNav;