import React from "react";
import Header from "../components/Header/Header";

import "./transaction.scss";
import Transaction from "../components/Transactions/Transaction";

const TransactionTypes = {
    Waiver: "WAIVER",
    TradeProposal: "TRADE_PROPOSAL",
    Roster: "ROSTER",
    FreeAgent: "FREEAGENT"
}

export const Transactions = (props) => {    
    const teams = props.info.teams;
    const transactionsPerWeek = props.info.transactions;     
    const executedTransactions = [];    
    const rosters = props.info.rosters;

    if (transactionsPerWeek) {       
        const validTransactionWeeks = transactionsPerWeek.filter(x => x != null);
        const weekAmount = validTransactionWeeks.length;
        const matchupPeriods = props.info.matchupPeriods;
        const amountOfMatchups = Object.keys(matchupPeriods).length;
        const finalMatchup = matchupPeriods[amountOfMatchups];
        finalMatchup.sort();
        const finalWeek = finalMatchup[finalMatchup.length - 1];

        transactionsPerWeek.forEach((transactionWeek, index) => {
            if (!transactionWeek) {
                return;
            }

            executedTransactions[index] = {
                title: `Prior to Week ${index}`
            };
            const successfullyExecuted = transactionWeek.filter(x => x?.status === "EXECUTED");
            const waiverTransactions = successfullyExecuted.filter(x => x.type === TransactionTypes.Waiver || x.type === TransactionTypes.FreeAgent || x.type === TransactionTypes.Roster);

            const formattedTransactions = [];
            waiverTransactions.forEach(transaction => {
                const teamMakingTransaction = teams.find(x => x.id === transaction.teamId);
                const addItem = transaction.items.find(x => x?.type === "ADD");
                const dropItem = transaction.items.find(x => x?.type === "DROP");

                let addInfo;
                let dropInfo;

                if (addItem) {
                    const addedPlayer = searchThroughAllTeams(rosters, addItem.playerId); //Rather than searching through all teams, just look through the teams that added them
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
                    const droppedPlayer = searchThroughAllTeams(rosters, dropItem.playerId);
                    const playerScored = droppedPlayer.playerPoolEntry.ratings[0].totalRating;
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

                formattedTransactions.push({
                    id: transaction.id,
                    scoringPeriodId: transaction.scoringPeriodId,
                    type: transaction.type,
                    addInfo: addInfo,
                    dropInfo: dropInfo,
                    team: teamMakingTransaction
                });
            });

            executedTransactions[index].transactions = formattedTransactions;
        });
    }

    return (
        <>
            <Header message="Transactions"/>
            <main className="transactions-view__main item-list-view">                
                {executedTransactions.map(weeksTransactions => {
                    if (!weeksTransactions) {
                        return;
                    }
                    return (
                        <section className="item-list-view__items-holder">
                            <h2>{weeksTransactions.title}</h2>
                            <div className="draft-view__draft-section">
                                {weeksTransactions.transactions.map(transaction => {
                                    return <Transaction key={transaction.id} transaction={transaction}/>
                                })}
                            </div>
                        </section>
                    )
                })} 
            </main>
        </>
    );
}

/* */

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