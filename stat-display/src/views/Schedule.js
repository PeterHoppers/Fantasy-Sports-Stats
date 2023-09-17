import React, {useEffect, useState} from "react";

import "./schedule.scss";

import { Scoreboard } from "../components/Scoreboard/Scoreboard";

export const Schedule = (props) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const scoreSchedule = [];
        const nonByeScores = props.info.scores.filter(score => score.home && score.away);
        const finalWeek = nonByeScores[nonByeScores.length - 1].matchupPeriodId;

        for (let scoreWeek = 1; scoreWeek <= finalWeek; scoreWeek++) {
            const weekScores = nonByeScores.filter(score => score.matchupPeriodId === scoreWeek);
            scoreSchedule[scoreWeek] = weekScores;
        }
        console.log("Scores", scoreSchedule);
        setScores(scoreSchedule);
    }, [props]);

    return (
        <>
            <main className="schedule-view__main">
                {scores && scores.map((score, index) => 
                    <>
                        <span>{"Week " + index}</span>
                        <Scoreboard
                            key = {"Week " + index}
                            scores = {score}
                            teams = {props.info.teams}
                            onClickScoreDisplay = {props.triggerMatchup}
                        />
                    </>
                )}
            </main>
        </>
        
    );
}