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
            <label class='menu-button-container' for="menu-toggle">
                <div class='menu-button'></div>
            </label>
            <ul class="menu">
                {props.options.map(page => {
                    return <li className={(props.currentPage === page ? "selected-link" : "")} onClick={() => {
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