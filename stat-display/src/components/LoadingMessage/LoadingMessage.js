import React from "react";
import './LoadingMessage.scss';

const LoadingMessage = (props) => {
    return (
        <div className="loading-message">
            <span className="loading-message__message">
                {props.message}
            </span>            
        </div>
    );
}

export default LoadingMessage;