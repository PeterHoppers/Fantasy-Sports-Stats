import React from "react";
import { TeamColors, PositionColors } from "../../definitions";
import './DraftPick.scss';
import PlayerDisplay from "../Generic/PlayerDisplay";

const DraftPick = (props) => {   
    const pick = props.pick;
    const draftPlayer = pick.playerInfo;
    const teamColors = TeamColors[pick.teamPicked.abbrev];
    const positionColor = PositionColors[draftPlayer.defaultPositionId];

    return (
        <div className="draft-pick" style={{borderColor: teamColors?.primary, backgroundColor: positionColor}}>
            <div className="draft-pick__title">
                <span>Pick #{pick.id} by {pick.teamPicked.abbrev}</span>
            </div>
            {draftPlayer && 
                <PlayerDisplay playerInfo={draftPlayer} playerRankings={pick.playerRatings}/>                
            }            
        </div>
    );
}

export default DraftPick;