import React from "react";
import { ACCENT_COLOR, PRIMARY_GRAPH_COLOR } from "../../definitions";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import './TransactionStats.scss';
import { getGraphWidth, DEFAULT_HEIGHT } from "../../api/graphData";

const TransactionStats = (props) => {      
    const transactionInfos = props.data;
    const isCurrentStandings = !(props.teams[0].rankCalculatedFinal);
    let teams;
    if (isCurrentStandings) { //TODO: Move this to shared logic with the standings
        teams = props.teams.sort((a, b) => a.currentProjectedRank - b.currentProjectedRank);
    } else {
        teams = props.teams.sort((a, b) => a.rankCalculatedFinal - b.rankCalculatedFinal);
    }

    const parentElement = document.querySelector(".draft-view__draft-section-holder");
    const graphWidth = getGraphWidth(parentElement);

    const teamsDraftData = getTransactionDataPerTeam(transactionInfos, teams);

    return (
        <>
            <section className="draft-view__draft-section-holder">
                <p className="draft-view__draft-stat-description">The following graphs order teams in order of finish, i.e. furthest left finished first and furthest right finished last. Due to ESPN not counting transactions before week 1, numbers here will differ from the 'Transaction Counter'.</p>
                {teamsDraftData.length > 0 &&
                    <>
                        <h2>Total Transactions</h2>
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" name="Amount of Transactions" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                        <h2>Players Added</h2>
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="playersAdded" name="Players Added" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart>                         
                        <h2>Players Dropped</h2>
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="playersDropped" name="Players Dropped" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>                    
                }                
            </section>
        </>
    );
}

function getTransactionDataPerTeam(transactionInfos, teams) {
    const formattedInfo = [];

    teams.forEach(team => {
        const teamTransactions = transactionInfos.filter(transaction => transaction?.team?.id === team.id);
        const playersAdded = teamTransactions.filter(transaction => transaction.addInfo);
        //TODO: To properly handle average length of players added, we need to remove duplicates caused by players being added twice and players being readded after being drafted
        //const playersWeekTotal = playersAdded.reduce((accumulator, currentValue) => accumulator + currentValue.addInfo.weeks, 0);
        //const playersWeekAverage = (playersWeekTotal / playersAdded.length).toFixed(2);
        const playersDropped = teamTransactions.filter(transaction => transaction.dropInfo);

        formattedInfo.push({
            transactions: teamTransactions,
            name: team.name,
            amount: teamTransactions.length,
            playersAdded: playersAdded.length,
            //playersWeekAverage: playersWeekAverage,
            playersDropped: playersDropped.length
        });
    });

    return formattedInfo;
}

export default TransactionStats;