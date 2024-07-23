import React from "react";
import { getDraftData } from "../api/draftData";
import DraftPick from "../components/Draft/DraftPick";
import { MissingPlayers } from "../components/Draft/MissingPlayers";
import { DraftFormat } from "../util";
import { useMemo, useState } from "react";
import DraftPickDisplay from "../components/Draft/DraftPickDisplay";
import Header from "../components/Header/Header";

import "./draft.scss";

export const Draft = (props) => {
    const [format, setFormat] = useState(DraftFormat.Round);
    const draftData = useMemo(() => getDraftData(props.year), [props.year]);
    const teams = props.info.teams;
    let pickInfos;

    if (draftData) {
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
        pickInfos = picks.map(pick => {
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
                    roundNumber: 0,
                    teamPicked: null
                }
            }
    
            const playerInfo = playerEntry.playerPoolEntry.player;
            const playerRatings = playerEntry.playerPoolEntry.ratings;
            return {
                id: pick.id,
                roundNumber: pick.roundId,
                teamPicked: teamRoster.teamInfo,
                playerInfo: playerInfo,
                playerPosition: playerInfo.defaultPositionId,
                playerRatings: playerRatings[0]
            }
        });
    }    

    function onSortByChange(newFormat) {
        setFormat(newFormat);
    }

    return (
        <>
            <Header message="Draft Summary"/>
            <main className="draft-view__main">                
                {pickInfos ?
                    <section className="draft-view__draft-pick-holder">
                        <div className="draft-view__draft-sort-holder">
                            <label htmlFor="sort-select">Sort By:</label>
                            <select onChange={(event) => onSortByChange(event.target.value)} defaultValue={DraftFormat.Round} name="sortOptions" id="sort-select">
                                {Object.keys(DraftFormat).map(format => {
                                    return <option key={format} value={format}>{format}</option>;
                                })}
                            </select>
                        </div>

                        <DraftPickDisplay data={pickInfos} format={format} teams={teams}/>
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
