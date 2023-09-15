import React from "react";
import './Header.scss';

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
            
        </header>
    );
}

export default Header;