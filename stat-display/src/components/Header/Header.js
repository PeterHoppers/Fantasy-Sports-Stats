import React from "react";
import './Header.scss';
import icon from "./../../images/info-circle.svg";

const Header = (props) => {
    //the extra parathesis allows this to return a function, rather than calling a function
    const updatePageHandler = (newPage) => () => {
        props.updatePage(newPage);
    }
   
    return (
        <header className="welcome-header">
            <span className="welcome-header__message">
                Welcome to the CUFFL!
            </span>
            <a className="welcome-header__link" href="https://docs.google.com/document/d/1CiT9zfmrUrmqypz7e5eAGjRzeayAjW9gqwhHM1OL9lI/edit?usp=sharing" target="_blank" rel="noreferrer">
                <img src={icon} alt="Opens the league charter."/>
            </a>
        </header>
    );
}

export default Header;