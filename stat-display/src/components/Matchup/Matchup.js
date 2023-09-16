import { Rosters } from "./Rosters";
import { TeamName } from "./TeamName";
import { PointTotal } from "./PointTotal";

import "./Matchup.scss";

export const Matchup = (props) => {
    return (
        <section className="matchup">
            <TeamName isHome = {true} teamInfo = {props.homeTeamInfo}/>
            <PointTotal />
            <Rosters />
            <PointTotal />
            <TeamName isHome = {false} teamInfo = {props.awayTeamInfo}/>
        </section>
    );
}