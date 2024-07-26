import React from "react";
import './Transaction.scss';
import PlayerDisplay from "../Generic/PlayerDisplay";

const Transaction = (props) => {   
    const transaction = props.transaction;
    const addInfo = transaction.addInfo;
    const dropInfo = transaction.dropInfo;

    return (
        <div className="transaction-display">
            <div className="transaction-display__title">
                <span>{`Transaction by ${transaction.team.abbrev}`}</span>
            </div>
            <div className="transaction-display__player-holders">
                {addInfo &&
                    <section className="transaction-display__player-section">
                        <h3>Added Player</h3>
                        <PlayerDisplay playerInfo={addInfo.player?.playerPoolEntry.player} playerRankings={addInfo.player?.playerPoolEntry.ratings[0]}/>
                        <div className="transaction-display__stats">
                            <div className="transaction-display__stat-section">
                                <p>Weeks On Roster</p>
                                <span>{addInfo.weeks}</span>
                            </div>
                            <div className="transaction-display__stat-section">
                                <p>Points On Roster</p>
                                <span>{addInfo.points}</span>
                            </div>
                        </div>       
                    </section>
                } 

                {dropInfo &&
                    <section className="transaction-display__player-section">
                        <h3>Dropped Player</h3>
                        <PlayerDisplay playerInfo={dropInfo.player?.playerPoolEntry.player} playerRankings={dropInfo.player?.playerPoolEntry.ratings[0]}/>
                        <div className="transaction-display__stats">
                            <div className="transaction-display__stat-section">
                                <p>Weeks Off Roster</p>
                                <span>{dropInfo.weeks}</span>
                            </div>
                            <div className="transaction-display__stat-section">
                                <p>Points Off Roster</p>
                                <span>{dropInfo.points}</span>
                            </div>
                        </div>                        
                    </section>
                }
            </div>                    
        </div>
    );
}

export default Transaction;