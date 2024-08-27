import React from "react";
import { ScoreTeamInfo } from "./ScoreTeamInfo";

export const ScoreDisplay = (props) => {
    let classes = "score-display";

    if (props.activeMatchup === props.id) {
        classes += " active";
    }

    if (!props.isEnabled) {
        classes += " disabled";
    }

    const hasTeams = (props.homeTeam && props.awayTeam);
    const onClickHandler = () => {
        if (props.isEnabled) {
            props.onClickScoreDisplay(props.id);
        }
    };

    return (
        <>
            {hasTeams &&
                <div className={classes} onClick={onClickHandler} title={(props.isEnabled) ? "Click to view more details about this match-up." : "Please wait until ESPN can project this match-up before viewing it."}>
                    <ScoreTeamInfo logo={props.homeTeam.logo} name={props.homeTeam.name} score={props.homeScore}/>
                    <ScoreTeamInfo logo={props.awayTeam.logo} name={props.awayTeam.name} score={props.awayScore}/>    
                </div>        
            }
        </> 
    );
}