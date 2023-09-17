export const TeamName = (props) => {
    let classes = "matchup__team";

    if (props.isHome) {
        classes += " matchup__home-team";
    } else {
        classes += " matchup__away-team";
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