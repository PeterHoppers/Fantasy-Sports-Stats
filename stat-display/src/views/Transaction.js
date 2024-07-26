import React from "react";
import Header from "../components/Header/Header";
import { useMemo, useState } from "react";

import "./transaction.scss";
import TransactionDisplay from "../components/Transactions/TransactionDisplay";
import TransactionStats from "../components/Transactions/TransactionStats";

import { TransactionView, TransactionFormat } from "../definitions";
import { MissingPlayers } from "../components/Draft/MissingPlayers";

const TransactionTypes = {
    Waiver: "WAIVER",
    TradeProposal: "TRADE_PROPOSAL",
    TradeAccepted: "TRADE_ACCEPT",
    Roster: "ROSTER",
    FreeAgent: "FREEAGENT"
}

export const Transactions = (props) => {    
    const [format, setFormat] = useState(TransactionFormat.Round);
    const [view, setView] = useState(TransactionView.AddDrop);
    
    const teams = props.info.teams;
    const transactionsPerWeek = props.info.transactions;      
    const rosters = props.info.rosters;
    const matchupPeriods = props.info.matchupPeriods;

    const executedTransactions = useMemo(() => createTransactionInfo(transactionsPerWeek, teams, rosters, matchupPeriods), [transactionsPerWeek, rosters, teams]);
    const tradePurposals = useMemo(() => getNumberofTradePurposals(transactionsPerWeek, teams), [transactionsPerWeek, teams]);

    function onSortByChange(newFormat) {
        setFormat(newFormat);
    }

    function onViewChange(newView) {
        setView(newView);
    }

    return (
        <>
            <Header message="Transactions"/>
            <main className="transactions-view__main item-list-view">                
            {executedTransactions?.length > 0 ?
                    <section className="item-list-view__items-holder">
                        <div className="draft-view__draft-selects-holder">
                            <div className="draft-view__draft-sort-holder">
                                {view === TransactionView.AddDrop &&
                                    <>
                                        <label htmlFor="sort-select">Sort By:</label>
                                        <select onChange={(event) => onSortByChange(event.target.value)} defaultValue={format} name="sortOptions" id="sort-select">
                                            {Object.values(TransactionFormat).map(format => {
                                                return <option key={format} value={format}>{format}</option>;
                                            })}
                                        </select>
                                    </>
                                }                                
                            </div>
                            <div className="draft-view__draft-sort-holder">
                                <label htmlFor="view-select">View:</label>
                                <select onChange={(event) => onViewChange(event.target.value)} defaultValue={TransactionView.AddDrop} name="viewOptions" id="view-select">
                                    {Object.values(TransactionView).map(format => {
                                        return <option key={format} value={format}>{format}</option>;
                                    })}
                                </select>
                            </div>
                        </div>                        

                        {view === TransactionView.AddDrop &&
                            <TransactionDisplay data={executedTransactions} format={format} teams={teams}/>
                        }

                        {view === TransactionView.Stats &&
                            <TransactionStats data={executedTransactions} teams={teams}/>
                        }
                        
                    </section>   
                    :
                    <p className="draft-view__error">No transactions have been made for this year at the moment.</p> 
                }
            </main>
        </>
    );
}

function createTransactionInfo(transactionsPerWeek, teams, rosters, matchupPeriods) {
    if (!transactionsPerWeek) {       
        return;
    }

    const executedTransactions = [];
    const validTransactionWeeks = transactionsPerWeek.filter(x => x != null);
    const weekAmount = validTransactionWeeks.length;
    const amountOfMatchups = Object.keys(matchupPeriods).length;
    const finalMatchup = matchupPeriods[amountOfMatchups];
    finalMatchup.sort();
    const finalWeek = finalMatchup[finalMatchup.length - 1];

    transactionsPerWeek.forEach((transactionWeek, index) => {
        if (!transactionWeek) {
            return;
        }

        const successfullyExecuted = transactionWeek.filter(x => x?.status === "EXECUTED");
        const waiverTransactions = successfullyExecuted.filter(x => x.type === TransactionTypes.Waiver || x.type === TransactionTypes.FreeAgent || x.type === TransactionTypes.Roster);

        waiverTransactions.forEach(transaction => {
            console.log(transaction);
            const teamMakingTransaction = teams.find(x => x.id === transaction.teamId);
            const addItem = transaction.items.find(x => x?.type === "ADD");
            const dropItem = transaction.items.find(x => x?.type === "DROP");

            let addInfo;
            let dropInfo;

            if (addItem) {
                let addedPlayer = searchThroughAllTeams(rosters, addItem.playerId); //Rather than searching through all teams, just look through the teams that added them
                if (!addedPlayer) {
                    addedPlayer = searchThroughMissingPlayers(addItem.playerId);
                }
                const addedPlayerStats = getPlayerInfoWithTeam(teamMakingTransaction.id, rosters, addItem.playerId, finalWeek)
                const addedPointsScored = addedPlayerStats.points;

                addInfo = {
                    item: addItem,
                    player: addedPlayer,
                    points: addedPointsScored,
                    weeks: addedPlayerStats.weeks
                }
            }

            if (dropItem) {
                let droppedPlayer = searchThroughAllTeams(rosters, dropItem.playerId);
                if (!droppedPlayer) {
                    droppedPlayer = searchThroughMissingPlayers(dropItem.playerId);
                }
                
                const playerScored = droppedPlayer?.playerPoolEntry?.ratings[0].totalRating ?? 0;
                const droppedPlayerStats = getPlayerInfoWithTeam(teamMakingTransaction.id, rosters, dropItem.playerId, finalWeek);
                const droppedPointsScored = (playerScored - droppedPlayerStats.points).toFixed(2);
                const weeksOffRoster = weekAmount - droppedPlayerStats.weeks;

                dropInfo = {
                    item: dropItem,
                    player: droppedPlayer,
                    points: droppedPointsScored,
                    weeks: weeksOffRoster
                }                                    
            }

            executedTransactions.push({
                id: transaction.id,
                period: index,
                proposedDate: transaction.proposedDate,
                type: transaction.type,
                addInfo: addInfo,
                dropInfo: dropInfo,
                team: teamMakingTransaction
            });
        });
    });
    

    return executedTransactions;
}

function searchThroughAllTeams(rosters, playerId) {
    let foundPlayer;
    rosters.forEach(rosterWeek => {
        if (!rosterWeek || foundPlayer) {
            return;
        }

        rosterWeek.forEach(roster => {
            if (foundPlayer) {
                return;
            }

            foundPlayer = roster.roster.entries.find(x => x.playerId === playerId);
        });
    });
    return foundPlayer;
}

function getPlayerInfoWithTeam(teamId, rosters, playerId, maxWeek) {
    let pointsScored = 0;
    let weeksOnRoster = 0;
    rosters.forEach((rosterWeek, weekNumber) => {
        if (!rosterWeek || weekNumber > maxWeek) {
            return;
        }

        const teamRoster = rosterWeek.find(x => x.id === teamId);
        const playerInfo = teamRoster.roster.entries.find(x => x.playerId === playerId);
        if (!playerInfo) {
            return;
        }

        const playerStats = playerInfo?.playerPoolEntry?.player.stats;
        
        if (!playerStats) {
            return;
        }

        weeksOnRoster++;
        const scoreEntries = playerStats.filter(stat => stat.scoringPeriodId === weekNumber);        
        if (scoreEntries.length === 0) {
            //This is empty if a week doesn't exist for a player (say the week hasn't played yet) or a D/ST bye week
            return;
        }

        const actualEntry = scoreEntries.find(entry => entry.statSourceId === 0);
        if (actualEntry) {            
            pointsScored += actualEntry.appliedTotal;            
        } else {
            //This isn't found when it is a positional player's bye week
        }
    });

    return {
        points: pointsScored.toFixed(2),
        weeks: weeksOnRoster
    }
}

function searchThroughMissingPlayers(playerId) {
    return MissingPlayers.find(player => player.playerId === playerId);
}

function getNumberofTradePurposals(transactionsPerWeek, teams) {
    if (!transactionsPerWeek) {       
        return;
    }

    const tradePurposals = [];
    transactionsPerWeek.forEach((transactionWeek, index) => {
        if (!transactionWeek) {
            return;
        }
        const possiblePurposals = transactionWeek.filter(x => x.type === TransactionTypes.TradeProposal);
        tradePurposals.push(...possiblePurposals);
    });

    return tradePurposals;
}