import { Rosters } from "./Rosters";
import { TeamName } from "./TeamName";
import { PointTotal } from "./PointTotal";

import "./Matchup.scss";

export const Matchup = (props) => {
    return (
        <section className="matchup">
            <TeamName isHome = {true} teamInfo = {props.homeTeamInfo}/>
            <div className="matchup__score-section">
                <div className="matchup__point-info-holder">
                    <PointTotal scoreInfo = {props.scoreInfo.home} />
                    <PointTotal scoreInfo = {props.scoreInfo.away}/>
                </div>
                <Rosters 
                    homeRoster = {props.homeRoster} 
                    awayRoster = {props.awayRoster}
                    week = {props.scoreInfo.matchupPeriodId}
                />
            </div>
            <TeamName isHome = {false} teamInfo = {props.awayTeamInfo}/>
        </section>
    );
}