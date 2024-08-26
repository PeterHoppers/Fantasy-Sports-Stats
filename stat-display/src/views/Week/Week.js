import React from "react";

import { Scoreboard } from "../../components/Scoreboard/Scoreboard";
import { Matchup } from "../../components/Matchup/Matchup";

import "./week.scss";

export const Week = (props) => {
    if (!props.info.matchupPeriods) {
        props.info.matchupPeriods = {"1":[1],"2":[2],"3":[3],"4":[4],"5":[5],"6":[6],"7":[7],"8":[8],"9":[9],"10":[10],"11":[11],"12":[12],"13":[13],"14":[14],"15":[15,16],"16":[17,18]};
    }

    const targetWeek = props.info.scores.find(score => score.id === props.matchUp).matchupPeriodId;
    const weekScores = props.info.scores.filter(score => score.matchupPeriodId === targetWeek);
    const matchupPeriod = props.info.matchupPeriods[targetWeek];
    return (
        <>
            <main className="week-view__main">
                <Matchup 
                   scores={weekScores}
                   teams={props.info.teams}
                   rosters = {props.info.rosters}
                   matchupPeriod = {matchupPeriod}
                   activeMatchup = {props.matchUp}
                   closeMatchup = {props.closeMatchup}
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