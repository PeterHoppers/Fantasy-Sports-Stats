import React from "react";
import './HamburgerMenu.scss';
import { useState } from "react";

export const HamburgerMenu = (props) => {
    const [isMenuOpen, setMenuOpenState] = useState(false);

    function onToggleChange(e) {
        const checked = !isMenuOpen;
        setMenuOpenState(checked);
    }

    return (
        <>
            <input id="menu-toggle" type="checkbox" onChange={onToggleChange} checked={isMenuOpen}/>
            <label className='menu-button-container' htmlFor="menu-toggle">
                <div className='menu-button'></div>
            </label>
            <ul className="menu">
                {props.options.map(page => {
                    return <li key={page} className={(props.currentPage === page ? "selected-link" : "")} onClick={() => {
                        props.onPageClick(page);
                        setMenuOpenState(false);
                    }}>
                        <span>{page}</span>                    
                    </li>;
                })}
            </ul>
        </> 
    )
    
}