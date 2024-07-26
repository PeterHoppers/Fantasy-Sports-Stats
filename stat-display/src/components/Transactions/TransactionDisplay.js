import React from "react";
import './TransactionDisplay.scss';
import Transaction from "./Transaction";
import { TransactionFormat } from "../../definitions";

const TransactionDisplay = (props) => {      //This should really be genericed out to overlap with PickDisplay
    const transactions = props.data;
    const format = props.format;
    const teams = props.teams;

    let formattedInfo = [];
    switch (format) {
        case TransactionFormat.Round:
            formattedInfo = formatInfoByRound(transactions);
            break;
        case TransactionFormat.Team:
            formattedInfo = formatInfoByTeam(transactions, teams);
            break;       
        default:
            break;
    }    

    return (
        <>
            {formattedInfo.map(section => {
                return (
                    <section key={section.title} className="draft-view__draft-section-holder">
                        <h2>{section.title}</h2>
                        <div className="draft-view__draft-section">
                            {section.transactions.map(transactionInfo => {
                                return <Transaction key={transactionInfo.id} transaction={transactionInfo}/>
                            })}
                        </div>
                    </section>
                )
            })}
        </>
    );
}

function formatInfoByRound(transactions) {
    const formattedInfo = [];
    const lastWeek = transactions.findLast(x => x).period;
    
    for (let weekNumber = 1; weekNumber <= lastWeek; weekNumber++) {
        const transactionInWeek = transactions.filter(pick => pick.period === weekNumber);
        formattedInfo.push({
            transactions: transactionInWeek,
            title: `Prior to Week ${weekNumber}`
        });
    }

    return formattedInfo;
}

function formatInfoByTeam(transactionInfos, teams) {
    const formattedInfo = [];

    teams.forEach(team => {
        const teamTransactions = transactionInfos.filter(pick => pick?.team?.id === team.id);
        formattedInfo.push({
            transactions: teamTransactions,
            title: `${team.name}'s Transactions`
        });
    });

    return formattedInfo;
}

export default TransactionDisplay;