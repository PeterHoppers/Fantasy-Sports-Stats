import React from "react";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts';

import { PositionId, TeamColors } from "../util";

import "./analysis.scss";

//Look into using https://recharts.org/en-US/api/BarChart

const LAST_REGULAR_SEASON_WEEK = 14;
const ACCENT_COLOR = "#c07b00";
const PRIMARY_GRAPH_COLOR = "#00338d";

export const Analysis = (props) => {    
    //create a dictionary of projected scores organized by team id and then week id, since the team id will be used more than the week
    const teams = props.info.teams;
    const rosters = props.info.rosters.flat();
    const scores = props.info.scores;

    const lastWeek = (LAST_REGULAR_SEASON_WEEK < props.info.currentWeek) ? LAST_REGULAR_SEASON_WEEK : props.info.currentWeek - 1;

    const matchups = getMatchupByWeek(scores, lastWeek);
    const totalPointsScores = getScoreByWeek(scores, lastWeek);
    const projectedScores = getProjectedScoreByWeek(teams, rosters, lastWeek);
    const rankingScores = getRankingByWeek(totalPointsScores, lastWeek);

    const projectedVsScoredData = getProjectedVsScoredData(teams, totalPointsScores, projectedScores);
    const opponentProjectedVsScoredData = getOpponentProjectedVsScoredData(teams, matchups, totalPointsScores, projectedScores);
    const rankingData = getRankingData(teams, rankingScores);
    const rankingsByWeekData = getRankingsPerWeek(teams, rankingScores);

    const screenWidth = window.screen.width;
    const graphWidth = screenWidth - 50;

    return (
        <>
            <main className="analysis-view__main">
                {projectedVsScoredData.length > 0 &&
                    <>
                        <h2>Projected Points vs. Actual Points</h2>
                        <BarChart width={graphWidth} height={350} data={projectedVsScoredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="projected" fill={ACCENT_COLOR} />
                            <Bar dataKey="scored" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>                    
                }
                {opponentProjectedVsScoredData.length > 0 &&
                    <>
                        <h2>Average Projected Points Against vs. Average Actual Points Against</h2>
                        <BarChart width={graphWidth} height={350} data={opponentProjectedVsScoredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="projected" fill={ACCENT_COLOR} />
                            <Bar dataKey="scored" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>
                    
                }
                {rankingData.length > 0 &&
                    <>
                        <h2>Teams Beaten</h2>
                        <BarChart width={graphWidth} height={350} data={rankingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="points" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart>
                    </>
                }
                {rankingsByWeekData.length > 0 &&
                    <>
                        <h2>Teams Beaten By Week</h2>
                        <LineChart width={graphWidth} height={350} data={rankingsByWeekData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {
                                teams.map(team => (
                                    <Line key={team.id} type="monotone" dataKey={team.name} stroke={TeamColors[team.abbrev]["primary"]} />
                                ))
                            }
                        </LineChart>
                    </>
                }
            </main>
        </>
        
    );

    function getMatchupByWeek(scores, lastWeek) {
        const matchupPerWeek = [];
        for (let week = 1; week <= lastWeek; week++) {
            const weekScores = scores.filter(score => score.matchupPeriodId === week);
            matchupPerWeek[week] = [];
            weekScores.forEach(score => {
                if (score.home && score.away) {
                    matchupPerWeek[week][score.home.teamId] = score.away.teamId;
                    matchupPerWeek[week][score.away.teamId] = score.home.teamId;                    
                }
            });
        }
        return matchupPerWeek;
    }

    function getScoreByWeek(scores, lastWeek) {
        const scorePerWeek = [];
        for (let week = 1; week <= lastWeek; week++) {
            const weekScores = scores.filter(score => score.matchupPeriodId === week);
            scorePerWeek[week] = [];
            weekScores.forEach(score => {
                if (score.home) {
                    scorePerWeek[week].push({
                        teamId: score.home.teamId,
                        points: score.home.totalPoints
                    });
                }
                if (score.away) {
                    scorePerWeek[week].push({
                        teamId: score.away.teamId,
                        points: score.away.totalPoints
                    });
                }
            });
        }
        return scorePerWeek;
    }

    function getProjectedScoreByWeek(teams, rosters, lastWeek) {
        const projectedScores = [];
        teams.forEach(team => {
            const teamRosters = rosters.filter(roster => roster?.id === team.id);
            let weekId = 1;            
            teamRosters.forEach(roster => {
                let projectedScoreTotal = 0;
                if (weekId > lastWeek) {
                    return;
                }
                if (!projectedScores[weekId]) {
                    projectedScores[weekId] = [];
                }
                roster.roster.entries.forEach(entry => {
                    if (entry.lineupSlotId === PositionId.Bench) {
                        return;
                    }
                    const projectedScore = entry.playerPoolEntry.player.stats.find(stat => stat.scoringPeriodId === weekId && stat.statSourceId === 1);

                    projectedScoreTotal += projectedScore?.appliedTotal ?? 0;
                });

                projectedScores[weekId].push({
                    teamId: team.id,
                    points: projectedScoreTotal
                });

                weekId++;
            });
        });
        return projectedScores;
    }

    function getRankingByWeek(scoresByWeek, lastWeek) {
        const rankingScores = [];
        for (let week = 1; week <= lastWeek; week++) {
            rankingScores[week] = [];
            scoresByWeek[week].sort((a, b) => a.points - b.points);

            for (let index = 0; index < scoresByWeek[week].length; index++) {
                const teamId = scoresByWeek[week][index].teamId;

                rankingScores[week].push({
                    teamId: teamId,
                    points: index
                });
            }
        }

        return rankingScores;
    }

    function getProjectedVsScoredData(teams, scoresByWeek, projectedScoresByWeek) {
        const data = [];
        teams.forEach(team => {
            const teamScores = scoresByWeek.flat().filter(score => score.teamId === team.id);
            const scoredPoints = teamScores.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
            const teamProjectedScores = projectedScoresByWeek.flat().filter(score => score.teamId === team.id);
            const projectedPoints = teamProjectedScores.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
    
            data.push({
                "name": team.name,
                "projected": projectedPoints.toFixed(2),
                "scored": scoredPoints.toFixed(2)
            });
        });

        data.sort((a, b) => a.scored - b.scored);
        return data;
    }

    function getOpponentProjectedVsScoredData(teams, matchups, scoresByWeek, projectedScoresByWeek) {
        const data = [];
        teams.forEach(team => {
            let opponentPointsProjected = 0;
            let opponentPointsScored = 0;
            let opponentsPlayed = 0;
            for (let week = 1; week <= lastWeek; week++) {
                const opponentId = matchups[week][team.id];

                //if we didn't play anyone that week, don't both with finding an opponent
                if (!opponentId) {
                    continue;
                }

                opponentsPlayed++;

                const opponentProjected = projectedScoresByWeek[week].find(projected => projected.teamId === opponentId);
                const opponentScored = scoresByWeek[week].find(projected => projected.teamId === opponentId);
                opponentPointsProjected += opponentProjected.points;
                opponentPointsScored += opponentScored.points;
            }
    
            data.push({
                "name": team.name,
                "projected": (opponentPointsProjected / opponentsPlayed).toFixed(2),
                "scored": (opponentPointsScored / opponentsPlayed).toFixed(2)
            });
        });

        data.sort((a, b) => a.scored - b.scored);
        return data;
    }

    function getRankingData(teams, rankingScores) {
        const data = [];
        teams.forEach(team => {
            const teamRankings = rankingScores.flat().filter(score => score.teamId === team.id);
            const teamTotalRank = teamRankings.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);

            data.push({
                "name": team.name,
                "points": teamTotalRank,
            });
        });

        data.sort((a, b) => a.points - b.points);
        return data;
    }

    function getRankingsPerWeek(teams, rankingScores)
    {
        const data = [];
        let weekNumber = 0;
        rankingScores.forEach(week => {
            const weekData = {};

            weekNumber++;
            weekData["name"] = "Week " + weekNumber;
            teams.forEach(team => {
                const teamInfo = week.filter(rank => rank.teamId === team.id);
                weekData[team.name] = teamInfo[0].points;
            });

            data.push(weekData);
        });

        return data;
    }
}