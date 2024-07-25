import React from "react";

import { MissingPlayers } from "../components/Draft/MissingPlayers";
import { DraftFormat, DraftView } from "../definitions";
import { useMemo, useState } from "react";
import DraftPickDisplay from "../components/Draft/DraftPickDisplay";
import Header from "../components/Header/Header";
import DraftStats from "../components/Draft/DraftStats";

import "./draft.scss";

const TransactionTypes = {
    Waiver: "WAIVER",
    TradeProposal: "TRADE_PROPOSAL",
    Roster: "ROSTER",
    FreeAgent: "FREEAGENT"
}

export const Transactions = (props) => {    
    const teams = props.info.teams;
    const transactionsPerWeek = props.info.transactions;
    
    const rosters = props.info.rosters;
    console.log(rosters);

    if (transactionsPerWeek) {
        const executedTransactions = [];
        const singleTeamTransaction = [];
        transactionsPerWeek.forEach((transactionWeek, index) => {
            if (transactionWeek) {
                executedTransactions[index] = [];
                const successfullyExecuted = transactionWeek.filter(x => x?.status === "EXECUTED");
                const waiverTransactions = successfullyExecuted.filter(x => x.type === TransactionTypes.Waiver || x.type === TransactionTypes.FreeAgent || x.type === TransactionTypes.Roster);

                waiverTransactions.forEach(transaction => {
                    const addItem = transaction.items.find(x => x?.type === "ADD");
                    const dropItem = transaction.items.find(x => x?.type === "DROP");
                    let addedPlayer;
                    let droppedPlayer;

                    if (addItem) {
                        addedPlayer = searchThroughAllTeams(rosters, addItem.playerId);
                    }

                    if (dropItem) {
                        droppedPlayer = searchThroughAllTeams(rosters, dropItem.playerId);
                    }
                    executedTransactions[index].push({
                        id: transaction.id,
                        scoringPeriodId: transaction.scoringPeriodId,
                        type: transaction.type,
                        add: addItem,
                        drop: dropItem,
                        adddedPlayer: addedPlayer,
                        droppedPlayer: droppedPlayer,
                        team: teams.find(x => x.id === transaction.teamId)
                    })
                });
            }            
        });

        executedTransactions.forEach(executedWeek => {
            var teamTransactions = executedWeek.filter(x => x.team.id === 6);
            singleTeamTransaction.push(...teamTransactions);
        });
        const added = singleTeamTransaction.filter(x => x.add);
        const drops = singleTeamTransaction.filter(x => x.drop);
    }


    return (
        <>
            <Header message="Transactions"/>
            <main className="transactions-view__main">                
                
            </main>
        </>
    );
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

function getPlayerProjectedScore(player, week) {
    const scoreEntries = player?.playerPoolEntry?.player.stats?.filter(stat => stat.scoringPeriodId === week);

    if (!scoreEntries?.length) {
        return {
            projected : 0.0,
            actual: "--"
        }
    }

    const projectedEntry = scoreEntries.find(entry => entry.statSourceId === 1);
    const actualEntry = scoreEntries.find(entry => entry.statSourceId === 0);

    return {
        projected : projectedEntry.appliedTotal.toFixed(1),
        actual: (actualEntry) ? actualEntry.appliedTotal.toFixed(1) : "--"
    }
}