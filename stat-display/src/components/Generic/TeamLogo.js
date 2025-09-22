import logo from "./../../images/defaultLogo.png";
import './TeamLogo.scss';

export const TeamLogo = (props) => {
    const teamLogo = props.logo;
    return (            
        <img src={teamLogo} className="team-logo" alt="Team Logo" onError= {event => {
            const fallbackURL = getFallbackLogo(props.name, logo);
            try {
                event.target.src = fallbackURL;
                event.onerror = null;
            }
            catch {
                event.onerror = null;
            }
        }}/>
    )
};

function getFallbackLogo(name, logo) {
    const rootFolder = "/logos/2025";
    let fileName = "";
    switch (name)
    {
        case "Lunar Monkey Typists":
            fileName = "/lunar.png";
            break;
        case "Reggae Pancake":
            fileName = "/raggae.png";
            break;
        case "Mimosas and Misreads ":
            fileName = "/misreads.png";
            break;
        case "Saintly Slimes":
            fileName = "/slimes.png"
            break;
        case "The Rosta Hamstas":
            fileName = "/hamsters.png";
            break;
        case "Waddling Warriors":
            fileName = "/waddling.png";
            break;
        case "Feisty Frogs":
            fileName = "/frog.png";
            break;
        case "Baseball is Better Anyway":
            fileName = "/baseball.png";
            break;
        case "Washington Wildflowers":
            fileName = "/wildflowers.png";
            break;
        default:
            return logo;
    }

    return `${window.location.href}${rootFolder}${fileName}`;
}