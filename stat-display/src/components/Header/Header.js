import React from "react";
import './Header.scss';
import icon from "./../../images/info-circle.svg";

const Header = (props) => {   
    return (
        <header className="welcome-header">
            <h1 className="welcome-header__message">
                {props.message}
            </h1>
            {props.hasLink &&
                <a className="welcome-header__link" href="https://docs.google.com/document/d/1CiT9zfmrUrmqypz7e5eAGjRzeayAjW9gqwhHM1OL9lI/edit?usp=sharing" target="_blank" rel="noreferrer">
                    <img src={icon} alt="Opens the league charter."/>
                </a>
            }            
        </header>
    );
}

export default Header;