import React from "react";
import './BottomNav.scss';


const BottomNav = (props) => {
    //the extra parathesis allows this to return a function, rather than calling a function
    const updatePageHandler = (newPage) => () => {
        props.updatePage(newPage);
    }
   
    return (
        <footer className="bottom-nav">
            <a>Example Link</a>
        </footer>
    );
}

export default BottomNav;