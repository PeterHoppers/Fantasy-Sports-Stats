export const ScoreTeamInfo = (props) => {
    return (
        <div className="score-display__team-info">
            <img src={props.logo} alt="Home Team's logo"/>
            <p className="score-display__team-name">{props.name}</p>
            <p className="score-display__team-score">{props.score.toFixed(1)}</p>
        </div>
    )
}