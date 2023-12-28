import { Rosters } from "./Rosters";
import { TeamName } from "./TeamName";
import { PointTotal } from "./PointTotal";

import "./Matchup.scss";
import {ReactComponent as CloseLogo} from "./close-circle.svg";
import { useState, useEffect } from "react";

export const Matchup = (props) => {
    const [matchupPeriodIndex, setMatchupPeriodIndex] = useState(0);

    useEffect(() => {
        updateMatchupPeriodIndex(0);
    }, []);

    const updateMatchupPeriodIndex = (newIndex) => {       
        setMatchupPeriodIndex(newIndex);

        let periodBtns = document.querySelectorAll(".matchup__week-toggle button");

        for (let index = 0; index < periodBtns.length; index++)
        {
            const btnIndex = periodBtns[index].dataset.index;
            if (btnIndex === newIndex.toString()) {
                periodBtns[index].classList.add("selected-btn");
            } else {
                periodBtns[index].classList.remove("selected-btn");
            }
        }
    }

    const getTeamForGame = (scoreInfo, isHome) => {      
        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        return props.teams.find(team => team.id === teamId);
    }

    const getRosterForGame = (scoreInfo, matchupPeriodId, isHome) => {
        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        const weeksRosters = props.rosters[matchupPeriodId];
        return weeksRosters.find(team => team.id === teamId);
    }

    const matchup = props.activeMatchup;
    const scoreInfo = props.scores.find(score => score.id === matchup);
    const matchupPeriodId = props.matchupPeriod[matchupPeriodIndex];
    const homeTeamInfo = getTeamForGame(scoreInfo, true);
    const awayTeamInfo = getTeamForGame(scoreInfo, false);
    const homeRoster = getRosterForGame(scoreInfo, matchupPeriodId, true);
    const awayRoster = getRosterForGame(scoreInfo, matchupPeriodId, false)

    return (
        <section className="matchup">
            <CloseLogo className="matchup-close" alt="Close matchup" onClick={props.closeMatchup}/>
            <div className="matchup__score-section">
                <div className="matchup__point-info-holder">
                    <PointTotal scoreInfo = {scoreInfo.home} />
                    <PointTotal scoreInfo = {scoreInfo.away}/>
                </div>
                <Rosters 
                    homeRoster = {homeRoster} 
                    awayRoster = {awayRoster}
                    week = {matchupPeriodId}
                />
            </div>
            <div className="matchup__team-section">
                <TeamName isHome = {true} teamInfo = {homeTeamInfo}/>
                <TeamName isHome = {false} teamInfo = {awayTeamInfo}/>
            </div>
            {
                (props.matchupPeriod.length > 1) &&
                <div className="matchup__week-toggle">
                    <button data-index={0} onClick={(event) => updateMatchupPeriodIndex(0, event)}>Round 1</button>
                    <button data-index={1} onClick={(event) => updateMatchupPeriodIndex(1, event)}>Round 2</button>
                </div>
            }
        </section>
    );
}