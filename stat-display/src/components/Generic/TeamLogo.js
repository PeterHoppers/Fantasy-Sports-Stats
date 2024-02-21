import logo from "./../../images/defaultLogo.png";

export const TeamLogo = (props) => {
    return (            
        <img src={props.logo} alt="Team Logo" onError= {event => {
            event.target.src = logo;
            event.onerror = null
        }}/>
    )
};