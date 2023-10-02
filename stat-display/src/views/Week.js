import React from "react";

import { Scoreboard } from "../components/Scoreboard/Scoreboard";
import { Matchup } from "../components/Matchup/Matchup";

import "./week.scss";

export const Week = (props) => {
    const targetWeek = props.info.scores.find(score => score.id === props.matchUp).matchupPeriodId;
    const weekScores = props.info.scores.filter(score => score.matchupPeriodId === targetWeek);
    return (
        <>
            <main className="week-view__main">
                <Matchup 
                   scores={weekScores}
                   teams={props.info.teams}
                   rosters = {props.info.rosters}
                   activeMatchup = {props.matchUp}
                />
                <Scoreboard   
                    week = {targetWeek}              
                    scores={weekScores} 
                    teams={props.info.teams}
                    onClickScoreDisplay = {props.triggerMatchup}
                    activeMatchup = {props.matchUp}
                />
            </main>
        </>
        
    );
}