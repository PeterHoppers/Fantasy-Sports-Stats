import React from "react";
import './BottomNav.scss';

import { Pages } from './../../util';

const BottomNav = (props) => {   
    return (
        <footer className="bottom-nav">
            {Object.keys(Pages).map(page => {
                return <div className={"bottom-nav__link-holder" + ((props.currentPage === page) ? " active-link" : "")} onClick={() => props.onPageClick(page)}>
                    <span className="bottom-nav__link">{page}</span>
                </div> 
            })}
            <div className="bottom-nav__year-select">
                <label htmlFor="year-select">Year:</label>
                <select onChange={(event) => props.onYearChange(event.target.value)} defaultValue={props.years[props.years.length - 1]} name="year" id="year-select">
                    {props.years.map((year) => {
                        return <option key={year} value={year.toString()}>{year}</option>
                    })}                    
                </select>
            </div>            
        </footer>
    );
}

export default BottomNav;