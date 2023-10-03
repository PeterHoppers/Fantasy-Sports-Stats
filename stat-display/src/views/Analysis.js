import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

import { Scoreboard } from "../components/Scoreboard/Scoreboard";
import { Matchup } from "../components/Matchup/Matchup";

import { PositionId } from "../util";

//Look into using https://recharts.org/en-US/api/BarChart


export const Analysis = (props) => {    
    //create a dictionary of projected scores organized by team id and then week id, since the team id will be used more than the week
    const teams = props.info.teams;
    const rosters = props.info.rosters.flat();
    const scores = props.info.scores;

    const projectedVsScoredData = [];

    console.log("Teams", teams);
    console.log("Rosters", rosters.flat());
    console.log("Scores", scores);

    const totalPointsScores = [];
    const projectedScores = []

    teams.forEach(team => {
        const homeTeamScores = scores.filter(score => score.home?.teamId === team.id && score.playoffTierType === "NONE");
        const awayTeamScores = scores.filter(score => score.away?.teamId === team.id && score.playoffTierType === "NONE");

        let totalPoints = 0;
        const totalHomePoints = homeTeamScores.reduce((accumulator, currentValue) => accumulator + currentValue.home.totalPoints, totalPoints);
        const totalAwayPoints = awayTeamScores.reduce((accumulator, currentValue) => accumulator + currentValue.away.totalPoints, totalPoints);

        totalPointsScores[team.id] = totalHomePoints + totalAwayPoints;

        let projectedScoreTotal = 0;
        const teamRosters = rosters.filter(roster => roster?.id === team.id);
        let weekId = 1;
        teamRosters.forEach(roster => {
            if (weekId > 14) {
                return;
            }            
            roster.roster.entries.forEach(entry => {
                if (entry.lineupSlotId === PositionId.Bench) {
                    return;
                }
                const projectedScore = entry.playerPoolEntry.player.stats.find(stat => stat.scoringPeriodId === weekId && stat.statSourceId === 1);
                projectedScoreTotal += projectedScore?.appliedTotal ?? 0;
            });
            weekId++;
        });
        projectedScores[team.id] = projectedScoreTotal;

        projectedVsScoredData.push({
            "name": team.name,
            "projected": projectedScoreTotal,
            "scored": totalHomePoints + totalAwayPoints
        });
    });

    return (
        <>
            <main className="analysis-view__main">
                {projectedVsScoredData.length > 0 &&
                    <BarChart width={1280} height={350} data={projectedVsScoredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="projected" fill="#8884d8" />
                        <Bar dataKey="scored" fill="#82ca9d" />
                    </BarChart>
                }
            </main>
        </>
        
    );
}