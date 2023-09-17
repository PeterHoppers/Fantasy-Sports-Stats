import React, {useEffect} from "react";
import { ScoreTeamInfo } from "./ScoreTeamInfo";

export const ScoreDisplay = (props) => {
    let classes = "score-display";

    if (props.activeMatchup === props.id) {
        classes += " active";
    }

    return (
        <div className={classes} onClick={() => props.onClickScoreDisplay(props.id)}>
            <ScoreTeamInfo logo={props.homeTeam.logo} name={props.homeTeam.name} score={props.homeScore}/>
            <ScoreTeamInfo logo={props.awayTeam.logo} name={props.awayTeam.name} score={props.awayScore}/>    
        </div>        
    );
}