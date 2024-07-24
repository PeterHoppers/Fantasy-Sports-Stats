import React from "react";
import { DefaultPositionNames } from "../../definitions";
import './DraftPick.scss';

const DraftPick = (props) => {   
    const pick = props.pick;
    const draftPlayer = pick.playerInfo;

    return (
        <div className="draft-pick">
            <div className="draft-pick__title">
                <span>Pick #{pick.id} by {pick.teamPicked.abbrev}</span>
            </div>
            {draftPlayer && 
                <div className="draft-pick__body">
                    <p className="draft-pick__name">{draftPlayer.fullName}, {DefaultPositionNames[draftPlayer.defaultPositionId]}</p>
                    <div className="draft-pick__stats-holder">
                        <div className="draft-pick__stat">
                            <p>Position Rank</p>
                            <span>{pick.playerRatings.positionalRanking}</span>
                        </div>
                        <div className="draft-pick__stat">
                            <p>Total Rank</p>
                            <span>{pick.playerRatings.totalRanking}</span>
                        </div>
                        <div className="draft-pick__stat">
                            <p>Total Points</p>
                            <span>{pick.playerRatings.totalRating.toFixed(2)}</span>
                        </div>                        
                    </div>
                </div>
            }            
        </div>
    );
}

export default DraftPick;