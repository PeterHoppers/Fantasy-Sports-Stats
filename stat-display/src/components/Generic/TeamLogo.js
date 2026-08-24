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
    const rootFolder = "/logos/";
    let fileName = "";
    switch (name)
    {
        case "Lunar Monkey Typists":
            fileName = "2025/lunar.png";
            break;
        case "Reggae Pancake":
            fileName = "2025/raggae.png";
            break;
        case "Mimosas and Misreads ":
            fileName = "2025/misreads.png";
            break;
        case "Saintly Slimes":
            fileName = "2025/slimes.png"
            break;
        case "The Rosta Hamstas":
            fileName = "2025/hamsters.png";
            break;
        case "Waddling Warriors":
            fileName = "2025/waddling.png";
            break;
        case "Feisty Frogs":
            fileName = "2025/frog.png";
            break;
        case "Baseball is Better Anyway":
            fileName = "2025/baseball.png";
            break;
        case "Washington Wildflowers":
            fileName = "2025/wildflowers.png";
            break;
        case "Princesses and Wizards":
            fileName = "2026/wizards.png";
            break;
        case "The Golphins":
            fileName = "2026/golphins.png";
            break;
        case "Super Snakes":
            fileName = "2026/snakes.png";
            break;
        case "The Best Wurst":
            fileName = "2026/wurst.png";
            break;
        default:
            return logo;
    }

    return `${window.location.href}${rootFolder}${fileName}`;
}