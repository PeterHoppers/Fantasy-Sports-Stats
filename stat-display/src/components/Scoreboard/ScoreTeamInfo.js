import { TeamLogo } from "./../Generic/TeamLogo";

export const ScoreTeamInfo = (props) => {
    return (
        <div className="score-display__team-info">
            <div className="score-display__logo-holder">
                <TeamLogo logo={props.logo} name={props.name}/>
            </div>            
            <p className="score-display__team-name">{props.name}</p>
            <p className="score-display__team-score">{props.score.toFixed(1)}</p>
        </div>
    )
}