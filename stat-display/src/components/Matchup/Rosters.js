import { PositionId, PositionNames } from "../../definitions";
import { PositionInfo } from "./PositionInfo";

const dummyInfo = {
    playerPoolEntry: {
        player: {
            fullName: "Empty Position"
        }
    }
};

// a table of PositionInfos
export const Rosters = (props) => {
    const positionMatchups = [];
    const homeRoster = props.homeRoster.roster;
    const awayRoster = props.awayRoster.roster;
    
    let playerCount = 0;
    for (const [key, value] of Object.entries(PositionId)) {
        if (value === PositionId.Bench) {
            continue;
        }
        const positionInfo = getPositionInfo(value, homeRoster, awayRoster, PositionNames[value]);
        for (let index = 0; index < positionInfo.home.length; index++) {
            positionMatchups[playerCount] = {
                key: key + playerCount,
                homePlayer: positionInfo.home[index],
                awayPlayer: positionInfo.away[index],
                positionName: positionInfo.name
            }
            playerCount++;
        }
    }

    return (
        <table className="matchup__roster">
            <tbody>
                {positionMatchups && positionMatchups.map(matchUp =>
                    <PositionInfo 
                        key = {matchUp.key}
                        homePlayer = {matchUp.homePlayer}
                        awayPlayer = {matchUp.awayPlayer}
                        positionName = {matchUp.positionName}
                        week = {props.week}
                    />             
                )}
            </tbody>
        </table>
        
    );
}

function getPositionInfo(positionId, homeRoster, awayRoster, positionName) {
    const homePlayer = homeRoster.entries.filter(entry => entry.lineupSlotId === positionId);
    const awayPlayer = awayRoster.entries.filter(entry => entry.lineupSlotId === positionId);

    while (homePlayer.lengthength > awayPlayer.length) {
        awayPlayer.push(dummyInfo);
    }

    while (homePlayer.length < awayPlayer.length) {
        homePlayer.push(dummyInfo);
    }

    return {
        home: homePlayer,
        away: awayPlayer,
        name: positionName
    }
}