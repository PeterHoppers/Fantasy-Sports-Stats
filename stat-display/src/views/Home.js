import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header";

import { Scoreboard } from "../components/Scoreboard/Scoreboard";
import { Matchup } from "../components/Matchup/Matchup";

import "./home.scss";

export const Home = (props) => {
    const [scores, setScores] = useState([]);
    const [matchup, setActiveMatchup] = useState(null);

    useEffect(() => {
        console.log("All Info", props.info);
        const currentScores = props.info.scores.filter(score => score.matchupPeriodId === props.info.currentWeek);
        setScores(currentScores);
    }, [props]);

    const triggerMatchup = (gameId) => {
        console.log("Game clicked", gameId);
        setActiveMatchup(gameId);
    }

    const getTeamForGame = (gameId, isHome) => {
        const scoreInfo = props.info.scores.find(score => score.id === gameId);
       
        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        return props.info.teams.find(team => team.id === teamId);
    }

    const getRosterForGame = (gameId, isHome) => {
        const scoreInfo = props.info.scores.find(score => score.id === gameId);

        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        const weeksRosters = props.info.rosters[scoreInfo.matchupPeriodId];
        return weeksRosters.find(team => team.id === teamId);
    }

    return (
        <>
            <Header/>
            <main className="home-view__main">
                {matchup && 
                    <Matchup 
                        homeTeamInfo = {getTeamForGame(matchup, true)} 
                        awayTeamInfo = {getTeamForGame(matchup, false)}
                        homeRoster = {getRosterForGame(matchup, true)}
                        awayRoster = {getRosterForGame(matchup, false)}
                        scoreInfo = {props.info.scores.find(score => score.id === matchup)}
                    />
                }
                <Scoreboard 
                    scores={scores} 
                    teams={props.info.teams}
                    onClickScoreDisplay = {triggerMatchup}
                />
            </main>
        </>
        
    );
}