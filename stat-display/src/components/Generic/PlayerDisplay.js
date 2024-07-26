//needs a playerInfo and a playerRatings

import { DefaultPositionNames } from '../../definitions';
import './PlayerDisplay.scss';

const PlayerDisplay = (props) => {   
    const playerInfo = props.playerInfo;
    const playerRankings = props.playerRankings;

    return (
        <div className="player-display__holder">
            <p className="player-display__name">{playerInfo?.fullName ?? "Unkown Player"}, {DefaultPositionNames[playerInfo?.defaultPositionId ?? 0]}</p>
            {playerRankings && 
                <div className="player-display__stats-holder">
                    <div className="player-display__stat">
                        <p>Position Rank</p>
                        <span>{playerRankings.positionalRanking}</span>
                    </div>
                    <div className="player-display__stat">
                        <p>Total Rank</p>
                        <span>{playerRankings.totalRanking}</span>
                    </div>
                    <div className="player-display__stat">
                        <p>Total Points</p>
                        <span>{playerRankings.totalRating.toFixed(2)}</span>
                    </div>                        
                </div>
            }            
        </div>
            
    );
}

export default PlayerDisplay;