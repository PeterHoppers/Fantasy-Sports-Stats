import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import TeamLineGraph from "../components/TeamLineGraph/TeamLineGraph";
import Header from "../components/Header/Header";

import { PositionId, LAST_REGULAR_SEASON_WEEK, ACCENT_COLOR, PRIMARY_GRAPH_COLOR } from "../definitions";

import "./analysis.scss";

//Look into using https://recharts.org/en-US/api/BarChart

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

    const totalPointsPerWeek = formatPoints(teams, totalPointsScores);
    const projectedPointsPerWeek = formatPoints(teams, projectedScores);
    const projectedVsScoredData = getProjectedVsScoredData(teams, totalPointsScores, projectedScores, lastWeek);
    const opponentProjectedVsScoredData = getOpponentProjectedVsScoredData(teams, matchups, totalPointsScores, projectedScores);
    const rankingsByWeekData = getRankingsPerWeek(teams, rankingScores);
    const rankingData = getRankingData(teams, rankingScores, lastWeek);

    const screenWidth = window.screen.width;
    const graphWidth = screenWidth - 50;

    return (
        <>
            <Header message={"Analysis"}/>
            <main className="analysis-view__main">
                {projectedPointsPerWeek.length > 0 &&
                    <>
                        <h2>Points Projected Per Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={projectedPointsPerWeek} teamData={teams} min={85} max={145}/>                        
                    </>
                }
                {totalPointsPerWeek.length > 0 &&
                    <>
                        <h2>Points Scored Per Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={totalPointsPerWeek} teamData={teams} min={35} max={200}/>                        
                    </>
                }
                {projectedVsScoredData.length > 0 &&
                    <>
                        <h2>Average Points Projected vs. Average Points Scored</h2>
                        <BarChart width={graphWidth} height={350} data={projectedVsScoredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[80, 140]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="projected" name="Points Projected" fill={ACCENT_COLOR} />
                            <Bar dataKey="scored" name="Points Scored" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>                    
                }
                {opponentProjectedVsScoredData.length > 0 &&
                    <>
                        <h2>Average Points Projected Against vs. Average Points Scored Against</h2>
                        <BarChart width={graphWidth} height={350} data={opponentProjectedVsScoredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[80, 140]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="projected" name="Average Projected Points Against" fill={ACCENT_COLOR} />
                            <Bar dataKey="scored" name="Average Points Scored Against" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>
                    
                }
                {rankingsByWeekData.length > 0 &&
                    <>
                        <h2>Teams Beaten By Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={rankingsByWeekData} teamData={teams} min={0} max={teams.length - 1}/>                        
                    </>
                }
                {rankingData.length > 0 &&
                    <>
                        <h2>Estimated Teams Beaten vs Actual Total Teams Beaten</h2>
                        <p>The estimation of number of teams beaten corresponds with a team's record. It estimates that a win equals beating ~75% of the other teams, while a lose equals only beating ~25% of the other teams. A bye week equals ~50%.</p>
                        <BarChart width={graphWidth} height={350} data={rankingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="projected" name="Estimated Teams Beaten" fill={ACCENT_COLOR} />
                            <Bar dataKey="points" name="Total Teams Beaten" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart>
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

    function formatPoints(teams, totalPointData) {
        const data = [];
        totalPointData.forEach((weekData, index) => {
            const dataName = "Week " + (index);
            const teamData = [];
            weekData.forEach(score => {
                const team = teams.find(x => x.id === score.teamId);
                teamData[team.name] = score.points.toFixed(2);
            });
            data.push({
                name: dataName,
                ...teamData
            });
        });

        return data;
    }

    function getProjectedVsScoredData(teams, scoresByWeek, projectedScoresByWeek, totalWeeks) {
        const data = [];
        teams.forEach(team => {
            const teamScores = scoresByWeek.flat().filter(score => score.teamId === team.id);
            const scoredPoints = teamScores.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
            const teamProjectedScores = projectedScoresByWeek.flat().filter(score => score.teamId === team.id);
            const projectedPoints = teamProjectedScores.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
    
            data.push({
                "name": team.name,
                "projected": (projectedPoints / totalWeeks).toFixed(2),
                "scored": (scoredPoints/ totalWeeks).toFixed(2)
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

    function getRankingData(teams, rankingScores, totalWeeks) {
        const data = [];
        const totalTeams = teams.length;
        const estimatedTeamsBeatenPerWin = Math.floor(totalTeams / 10 * 7.5);
        const estimatedTeamsBeatenPerLoss = Math.floor(totalTeams / 10 * 2.5);
        const estimatedTeamsBeatenPerMiss = totalTeams / 2;

        teams.forEach(team => {
            const teamRankings = rankingScores.flat().filter(score => score.teamId === team.id);
            const teamTotalRank = teamRankings.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
            const estimateForWins = team.record.overall.wins * estimatedTeamsBeatenPerWin;
            const estimateForLoss = team.record.overall.losses * estimatedTeamsBeatenPerLoss;
            const missedWeeks = totalWeeks - team.record.overall.wins - team.record.overall.losses;
            const estimateForMiss = estimatedTeamsBeatenPerMiss * missedWeeks;
            const estimateRank = Math.floor(estimateForWins + estimateForLoss + estimateForMiss);

            data.push({
                "name": team.name,
                "points": teamTotalRank,
                "projected": estimateRank
            });
        });

        data.sort((a, b) => a.projected - b.projected);
        return data;
    }

    function getRankingsPerWeek(teams, rankingScores) {
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