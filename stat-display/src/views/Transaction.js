import React from "react";

import { MissingPlayers } from "../components/Draft/MissingPlayers";
import { DraftFormat, DraftView } from "../definitions";
import { useMemo, useState } from "react";
import DraftPickDisplay from "../components/Draft/DraftPickDisplay";
import Header from "../components/Header/Header";
import DraftStats from "../components/Draft/DraftStats";

import "./draft.scss";
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
        transactionsPerWeek.forEach((transactionWeek, index) => {
            if (transactionWeek) {
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

                    let addedPlayer;
                    let addedPointsScored;
                    let droppedPlayer;
                    let droppedPointsScored;

                    if (addItem) {
                        addedPlayer = searchThroughAllTeams(rosters, addItem.playerId); //Rather than searching through all teams, just look through the teams that added them
                        addedPointsScored = pointsScoredForTeam(teamMakingTransaction.id, rosters, addItem.playerId);
                    }

                    if (dropItem) {
                        droppedPlayer = searchThroughAllTeams(rosters, dropItem.playerId);
                        const playerScored = droppedPlayer.playerPoolEntry.ratings[0].totalRating;
                        droppedPointsScored = playerScored - pointsScoredForTeam(teamMakingTransaction.id, rosters, dropItem.playerId);
                    }

                    formattedTransactions.push({
                        id: transaction.id,
                        scoringPeriodId: transaction.scoringPeriodId,
                        type: transaction.type,
                        add: addItem,
                        addedPointsScored: addedPointsScored,
                        adddedPlayer: addedPlayer,
                        drop: dropItem,
                        droppedPointsScored: droppedPointsScored,
                        droppedPlayer: droppedPlayer,
                        team: teamMakingTransaction
                    });
                });

                executedTransactions[index].transactions = formattedTransactions;
            }            
        });
    }

    return (
        <>
            <Header message="Transactions"/>
            <main className="transactions-view__main">                
                {executedTransactions.map(weeksTransactions => {
                    if (!weeksTransactions) {
                        return;
                    }
                    return (
                        <section className="draft-view__draft-section-holder">
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

function pointsScoredForTeam(teamId, rosters, playerId) {
    let pointsScored = 0;
    rosters.forEach((rosterWeek, weekNumber) => {
        if (!rosterWeek) {
            return;
        }

        const teamRoster = rosterWeek.find(x => x.id === teamId);
        const playerInfo = teamRoster.roster.entries.find(x => x.playerId === playerId);
        const playerStats = playerInfo?.playerPoolEntry?.player.stats;
        
        if (!playerStats) {
            return;
        }

        const scoreEntries = playerStats.filter(stat => stat.scoringPeriodId === weekNumber);        
        if (!scoreEntries) {
            return;
        }

        const actualEntry = scoreEntries.find(entry => entry.statSourceId === 0);
        if (actualEntry) {
            pointsScored += actualEntry.appliedTotal;
        }                
    });

    return pointsScored.toFixed(2);
}