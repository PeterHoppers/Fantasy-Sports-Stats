import React from "react";
import {ScoreDisplay} from "./ScoreDisplay.js";

import "./Scoreboard.scss";

export const Scoreboard = (props) => {
    return (
        <section className="scoreboard">
            <span className="scoreboard-week">{"Week " + props.week}</span>
            <div className="scoreboard-holder">           
                {props.scores && props.scores.map(score =>
                    {
                        if (!score.home || !score.away) {
                            return;
                        }

                        const homeTeam = props.teams.find(team => team.id === score.home.teamId);
                        const awayTeam = props.teams.find(team => team.id === score.away.teamId);
                        
                        return <ScoreDisplay
                            key = {score.id}
                            id = {score.id}
                            homeTeam = {homeTeam}
                            awayTeam = {awayTeam}
                            homeScore = {getScoreForTeam(score.home)}
                            awayScore = {getScoreForTeam(score.away)}
                            onClickScoreDisplay = {props.onClickScoreDisplay}
                            activeMatchup = {props.activeMatchup}
                        />
                    }                
                )}
             </div>
        </section>
    );
}

function getScoreForTeam(teamScore) {
    if (teamScore.totalPointsLive) {
        return teamScore.totalPointsLive
    } else {
        return teamScore.totalPoints;
    }    
}
