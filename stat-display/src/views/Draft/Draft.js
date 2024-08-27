import React from "react";
import { getDraftData } from "../../api/draftData";
import { MissingPlayers } from "../../components/Draft/MissingPlayers";
import { DraftFormat, DraftView } from "../../definitions";
import { useMemo, useState } from "react";
import DraftPickDisplay from "../../components/Draft/DraftPickDisplay";
import Header from "../../components/Header/Header";
import DraftStats from "../../components/Draft/DraftStats";

import "./draft.scss";

export const Draft = (props) => {
    const [format, setFormat] = useState(DraftFormat.Round);
    const [view, setView] = useState(DraftView.Overview);
    const draftData = useMemo(() => getDraftData(props.year), [props.year]);
    const pickInfos = useMemo(() => createPickInfo(draftData, props.info.teams, props.info.rosters), [props]);
    const teams = props.info.teams;

    function createPickInfo(draftData, teams, rosterWeeks) {
        let pickInfos;

        if (draftData) {
            const rosters = rosterWeeks[1];
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
                    playerEntry = searchThroughAllTeams(rosterWeeks, pick.playerId);
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
                    playerRatings: playerRatings[0],
                    playerRank: (playerRatings[0].totalRanking === 0) ? 1000 : playerRatings[0].totalRanking
                }
            });
        }    

        return pickInfos;
    }

    function onSortByChange(newFormat) {
        setFormat(newFormat);
    }

    function onViewChange(newView) {
        setView(newView);
    }

    let draftViewClass = "draft-view__main item-list-view";

    if (view === DraftView.Stats) {
        draftViewClass += " item-view__stats";
    }

    return (
        <>
            <Header message="Draft Summary"/>
            <main className={draftViewClass}>                
                {pickInfos ?
                    <section className="item-list-view__items-holder">
                        <div className="item-list-view__selects-holder">
                            <div className="item-list-view__sort-holder">
                                {view === DraftView.Overview &&
                                    <>
                                        <label htmlFor="sort-select">Sort By:</label>
                                        <select onChange={(event) => onSortByChange(event.target.value)} defaultValue={format} name="sortOptions" id="sort-select">
                                            {Object.values(DraftFormat).map(format => {
                                                return <option key={format} value={format}>{format}</option>;
                                            })}
                                        </select>
                                    </>
                                }                                
                            </div>
                            <div className="item-list-view__sort-holder">
                                <label htmlFor="view-select">View:</label>
                                <select onChange={(event) => onViewChange(event.target.value)} defaultValue={DraftView.Overview} name="viewOptions" id="view-select">
                                    {Object.values(DraftView).map(format => {
                                        return <option key={format} value={format}>{format}</option>;
                                    })}
                                </select>
                            </div>
                        </div>                        

                        {view === DraftView.Overview 
                            ? <DraftPickDisplay data={pickInfos} format={format} teams={teams}/>
                            : <DraftStats data={pickInfos} teams={teams}/>
                        }
                        
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
