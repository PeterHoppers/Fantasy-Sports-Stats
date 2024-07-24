import React from "react";
import { DefaultPositionNames } from "../../util";
import './DraftPickDisplay.scss';
import DraftPick from "./DraftPick";
import { DraftFormat } from "../../util";

const DraftPickDisplay = (props) => {      
    const pickInfos = props.data;
    const format = props.format;
    const teams = props.teams;

    let formattedInfo = [];
    switch (format) {
        case DraftFormat.Round:
            formattedInfo = formatInfoByRound(pickInfos);
            break;
        case DraftFormat.Team:
            formattedInfo = formatInfoByTeam(pickInfos, teams);
            break;
        case DraftFormat.PositionRank:
            formattedInfo = formatInfoByPosition(pickInfos, true);
            break;
        case DraftFormat.PositionPick:
            formattedInfo = formatInfoByPosition(pickInfos, false);
            break;
        default:
            break;
    }    

    return (
        <>
            {formattedInfo.map(section => {
                return (
                    <section className="draft-view__draft-section-holder">
                        <h2>{section.title}</h2>
                        <div className="draft-view__draft-section">
                            {section.picks.map(pickInfo => {
                                return <DraftPick key={pickInfo.id} pick={pickInfo}/>
                            })}
                        </div>
                    </section>
                )
            })}
        </>
    );
}

function formatInfoByRound(pickInfos) {
    const formattedInfo = [];
    const lastRound = pickInfos.findLast(x => x.playerInfo).roundNumber;
    
    for (let roundNumber = 1; roundNumber <= lastRound; roundNumber++) {
        const picksInRound = pickInfos.filter(pick => pick.roundNumber === roundNumber);
        formattedInfo.push({
            picks: picksInRound,
            title: `Round ${roundNumber}`
        });
    }

    return formattedInfo;
}

function formatInfoByTeam(pickInfos, teams) {
    const formattedInfo = [];

    teams.forEach(team => {
        const teamPicks = pickInfos.filter(pick => pick?.teamPicked?.id === team.id);
        formattedInfo.push({
            picks: teamPicks,
            title: `${team.name}'s Picks`
        });
    });

    return formattedInfo;
}

function formatInfoByPosition(pickInfos, isOrderedByRank) {
    const formattedInfo = []

    Object.keys(DefaultPositionNames).forEach(position => {
        const positionPicks = pickInfos.filter(pick => pick?.playerPosition?.toString() === position);

        if (positionPicks.length > 0) {
            if (isOrderedByRank) {
                positionPicks.sort((a, b) => {
                    return a.playerRank - b.playerRank;
                });
            }
           
            formattedInfo.push({
                picks: positionPicks,
                title: `${DefaultPositionNames[position]}s Picked`
            });
        }
    });

    return formattedInfo;
}

export default DraftPickDisplay;