import React from "react";
import { DefaultPositionNames } from "../../definitions";
import './DraftPick.scss';
import PlayerDisplay from "../Generic/PlayerDisplay";

const DraftPick = (props) => {   
    const pick = props.pick;
    const draftPlayer = pick.playerInfo;

    return (
        <div className="draft-pick">
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