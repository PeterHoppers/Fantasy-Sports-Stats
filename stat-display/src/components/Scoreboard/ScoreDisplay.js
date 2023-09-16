import React, {useEffect} from "react";
import { ScoreTeamInfo } from "./ScoreTeamInfo";

export const ScoreDisplay = (props) => {
    return (
        <div className="score-display" onClick={() => props.onClickScoreDisplay(props.id)}>
            <ScoreTeamInfo logo={props.homeTeam.logo} name={props.homeTeam.name} score={props.homeScore}/>
            <ScoreTeamInfo logo={props.awayTeam.logo} name={props.awayTeam.name} score={props.awayScore}/>    
        </div>        
    );
}