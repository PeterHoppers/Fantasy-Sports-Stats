export const TeamName = (props) => {
    let classes = "matchup__team-name";

    if (props.isHome) {
        classes += " matchup__home-team";
    } else {
        classes += " matchup__away-team";
    }

    return (
        <section className={classes}>
            <img src={props.teamInfo.logo} alt="Home Team's logo"/>
            <p className="score-display__team-name">{props.teamInfo.name}</p>
        </section>
    );
}