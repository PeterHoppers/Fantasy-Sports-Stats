import React from "react";
import { PositionId, TeamColors } from "../util";
import { getDraftData } from "../api/draftData";
import DraftPick from "../components/Draft/DraftPick";
import { MissingPlayers } from "../components/Draft/MissingPlayers";

import "./draft.scss";

export const Draft = (props) => {    
    const draftData = getDraftData(props.year);
    const roundInfo = [];

    if (draftData) {
        const teams = props.info.teams;
        const rosters = props.info.rosters[1];
        const teamRosterInfo = teams.map(team => {
            const startingRoster = rosters.find((roster) => roster.id === team.id);
            return {
                id: team.id,
                teamInfo: team,
                rosterInfo: startingRoster.roster
            }
        });
    
        
        const picks = draftData.draftDetail.picks;
        const pickInfos = picks.map(pick => {
            const teamRoster = teamRosterInfo.find((team) => pick.teamId === team.id);        
            let playerEntry = teamRoster.rosterInfo.entries.find(entry => entry.playerId === pick.playerId);
    
            if (!playerEntry) {
                playerEntry = searchThroughMissingPlayers(pick.playerId);
            }
        
            if (!playerEntry) {
                playerEntry = searchThroughAllTeams(props.info.rosters, pick.playerId);
            }
    
            if (!playerEntry) {
                return {
                    id: pick.id,
                    roundNumber: pick.roundId,
                    teamPicked: teamRoster.teamInfo
                }
            }
    
            const playerInfo = playerEntry.playerPoolEntry.player;
            const playerRatings = playerEntry.playerPoolEntry.ratings;
            return {
                id: pick.id,
                roundNumber: pick.roundId,
                teamPicked: teamRoster.teamInfo,
                playerInfo: playerInfo,
                playerRatings: playerRatings[0]
            }
        });
    
        const lastRound = pickInfos.findLast(x => x.playerInfo).roundNumber;
    
        for (let roundNumber = 1; roundNumber <= lastRound; roundNumber++) {
            const picksInRound = pickInfos.filter(pick => pick.roundNumber === roundNumber);
            roundInfo.push({
                picks: picksInRound,
                number: roundNumber
            });
        }
    }    

    return (
        <>
            <main className="draft-view__main">
                <h1>Draft Summary</h1>
                {roundInfo.length > 0 ?
                    <section className="draft-view__draft-pick-holder">
                        {roundInfo.map(round => {
                            return (
                                <section className="draft-view__draft-round-holder">
                                    <h2>Round {round.number}</h2>
                                    <div className="draft-view__draft-round">
                                        {round.picks.map(pickInfo => {
                                            return <DraftPick key={pickInfo.id} pick={pickInfo}/>
                                        })}
                                    </div>
                                </section>
                            )
                                                  
                        })}
                    </section>   
                    :
                    <p className="draft-view__error">Draft information will be displayed after the draft.</p> 
                }
                            
            </main>
        </>
    );
}

function searchThroughAllTeams(rosters, playerId) {
    let foundPlayer;
    rosters.forEach(rosterWeek => {
        if (!rosterWeek || foundPlayer) {
            return;
        }

        rosterWeek.forEach(roster => {
            foundPlayer = roster.roster.entries.find(x => x.playerId === playerId);
            if (foundPlayer) {
                return foundPlayer;
            }
        });
    });
}

function searchThroughMissingPlayers(playerId) {
    return MissingPlayers.find(player => player.playerId === playerId);
}
