import React from "react";
import './Transaction.scss';
import PlayerDisplay from "../Generic/PlayerDisplay";

const Transaction = (props) => {   
    const transaction = props.transaction;
    const addedPlayer = transaction.adddedPlayer;
    const droppedPlayer = transaction.droppedPlayer;

    return (
        <div className="transaction-display">
            <div className="transaction-display__title">
                <span>{`Transaction by ${transaction.team.abbrev}`}</span>
            </div>
            <div className="transaction-display__player-holders">
                {addedPlayer && 
                    <section className="transaction-display__player-section">
                        <h3>Added Player</h3>
                        <PlayerDisplay playerInfo={addedPlayer.playerPoolEntry.player} playerRankings={addedPlayer.playerPoolEntry.ratings[0]}/>
                        <div className="transaction-display__stat-section">
                            <p>Points On Roster</p>
                            <span>{transaction.addedPointsScored}</span>
                        </div>
                    </section>
                } 

                {droppedPlayer && 
                    <section className="transaction-display__player-section">
                        <h3>Dropped Player</h3>
                        <PlayerDisplay playerInfo={droppedPlayer.playerPoolEntry.player} playerRankings={droppedPlayer.playerPoolEntry.ratings[0]}/>
                        <div className="transaction-display__stat-section">
                            <p>Points Off Roster</p>
                            <span>{transaction.droppedPointsScored}</span>
                        </div>
                    </section>
                }
            </div>                    
        </div>
    );
}

export default Transaction;