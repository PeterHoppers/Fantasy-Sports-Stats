import { TeamColors } from "../../util";

export const TeamName = (props) => {
    const teamColors = TeamColors[props.teamInfo.abbrev];
    const matchupRoot = document.documentElement;    

    let classes = "matchup__team";

    if (props.isHome) {
        classes += " matchup__home-team";
        if (teamColors) {
            matchupRoot.style.setProperty('--home-team-primary-color', teamColors['primary']);
            matchupRoot.style.setProperty('--home-team-secondary-color', teamColors['secondary']);
        }
       
    } else {
        classes += " matchup__away-team";
        if (teamColors) {
            matchupRoot.style.setProperty('--away-team-primary-color', teamColors['primary']);
            matchupRoot.style.setProperty('--away-team-secondary-color', teamColors['secondary']);
        }
    }

    const teamFullName = props.teamInfo.name;
    const teamLocation = teamFullName.substring(0, teamFullName.indexOf(' '));
    const teamName = teamFullName.substring(teamFullName.indexOf(' ') + 1);
    
    return (
        <section className={classes}>
            {props.isHome && 
                <div className="matchup__team-logo-holder">
                    <img src={props.teamInfo.logo} alt="Home team's logo"/>
                </div>
            }
            <div className="matchup__team-name-holder">
                <p className="matchup__team-name-location">{teamLocation}</p>
                <p className="matchup__team-name-nickname">{teamName}</p>
            </div>        
            {!props.isHome && 
                <div className="matchup__team-logo-holder">
                    <img src={props.teamInfo.logo} alt="Away team's logo"/>
                </div>                
            }    
        </section>
    );
}