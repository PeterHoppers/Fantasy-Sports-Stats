import { Rosters } from "./Rosters";
import { TeamName } from "./TeamName";
import { PointTotal } from "./PointTotal";

import "./Matchup.scss";

export const Matchup = (props) => {
    const getTeamForGame = (gameId, isHome) => {
        const scoreInfo = props.scores.find(score => score.id === gameId);
       
        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        return props.teams.find(team => team.id === teamId);
    }

    const getRosterForGame = (gameId, isHome) => {
        const scoreInfo = props.scores.find(score => score.id === gameId);

        let teamId;
        if (isHome) {
            teamId = scoreInfo.home.teamId;
        } else {
            teamId = scoreInfo.away.teamId;
        }

        let targetRosterWeek = scoreInfo.matchupPeriodId;
        if (targetRosterWeek >= props.rosters.length) {
            targetRosterWeek = props.rosters.length - 1;
        }
        const weeksRosters = props.rosters[targetRosterWeek];
        return weeksRosters.find(team => team.id === teamId);
    }

    const matchup = props.activeMatchup;
    const homeTeamInfo = getTeamForGame(matchup, true);
    const awayTeamInfo = getTeamForGame(matchup, false);
    const homeRoster = getRosterForGame(matchup, true);
    const awayRoster = getRosterForGame(matchup, false)
    const scoreInfo = props.scores.find(score => score.id === matchup);

    return (
        <section className="matchup">           
            <div className="matchup__score-section">
                <div className="matchup__point-info-holder">
                    <PointTotal scoreInfo = {scoreInfo.home} />
                    <PointTotal scoreInfo = {scoreInfo.away}/>
                </div>
                <Rosters 
                    homeRoster = {homeRoster} 
                    awayRoster = {awayRoster}
                    week = {scoreInfo.matchupPeriodId}
                />
            </div>
            <div className="matchup__team-section">
                <TeamName isHome = {true} teamInfo = {homeTeamInfo}/>
                <TeamName isHome = {false} teamInfo = {awayTeamInfo}/>
            </div>
        </section>
    );
}