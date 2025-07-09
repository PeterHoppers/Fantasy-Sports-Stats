import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import TeamLineGraph from "../../components/TeamLineGraph/TeamLineGraph";
import Header from "../../components/Header/Header";

import { PositionId, ResultOptions, LAST_REGULAR_SEASON_WEEK, ACCENT_COLOR, PRIMARY_GRAPH_COLOR } from "../../definitions";

import "./analysis.scss";
import { getGraphWidth, DEFAULT_HEIGHT, FADE_VALUE } from "../../api/graphData";

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
    const scoresPerPosition = getPointsScoredPerPosition(teams, rosters, lastWeek);
    console.log(scoresPerPosition);
    const rankingScores = getRankingByWeek(totalPointsScores, lastWeek);

    const totalPointsPerWeek = formatPoints(teams, totalPointsScores);
    const projectedPointsPerWeek = formatPoints(teams, projectedScores);
    const differenceInPointsPerWeek = getDifferenceInProjectedVsScoredByWeek(totalPointsPerWeek, projectedPointsPerWeek);
    const projectedVsScoredData = getProjectedVsScoredData(teams, totalPointsScores, projectedScores, lastWeek);
    const opponentProjectedVsScoredData = getOpponentProjectedVsScoredData(teams, matchups, totalPointsScores, projectedScores);
    const rankingsByWeekData = getRankingsPerWeek(teams, rankingScores);
    const rankingData = getRankingData(teams, rankingScores, lastWeek);

    const holderElement = document.querySelector("analysis-view__main");
    const graphWidth = getGraphWidth(holderElement);

    const customDotRenderer = (props) => {
        let fillColor = "#000000";
        const winnerColor = "#0ed145";
        const loserColor = "#ec1c24";

        const { cx, cy, stroke, r, payload, value, dataKey } = props;
        if (payload.winners.includes(dataKey)) {
            fillColor = winnerColor;
        } else if (payload.losers.includes(dataKey)) {
            fillColor = loserColor;
        }

        if (stroke.length > 6 && stroke.endsWith(FADE_VALUE)) {
            fillColor += FADE_VALUE;
        }

        return <svg fill={fillColor}>
            <circle cx={cx} cy={cy} r={r + 2} />;
        </svg>        
    }

    return (
        <>
            <Header message={"Analysis"}/>
            <main className="analysis-view__main">
                {projectedPointsPerWeek.length > 0 &&
                    <>
                        <h2>Points Projected Per Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={projectedPointsPerWeek} teamData={teams} min={70} max={150}/>
                    </>
                }
                {totalPointsPerWeek.length > 0 &&
                    <>
                        <h2>Points Scored Per Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={totalPointsPerWeek} teamData={teams} min={40} max={200}/>                        
                    </>
                }
                {differenceInPointsPerWeek.length > 0 &&
                    <>
                        <h2>Difference In Points Scored vs. Points Projected Per Week</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={differenceInPointsPerWeek} teamData={teams} min={-80} max={80}/>                        
                    </>
                }
                {projectedVsScoredData.length > 0 &&
                    <>
                        <h2>Average Points Projected vs. Average Points Scored</h2>
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={projectedVsScoredData}>
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
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={opponentProjectedVsScoredData}>
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
                        <p>This chart orders everyone's score by each week and gives a value to each team based upon where they ranked. The team with the lowest score gets a value of 0 while the team with the highest score gets a value equal to the number of teams in the league - 1. Teams with green dots won that week, teams with red dots lost, and teams with black dots were on bye.</p>
                        <TeamLineGraph graphWidth={graphWidth} data={rankingsByWeekData} teamData={teams} min={0} max={teams.length - 1} customDotRenderer={customDotRenderer}/>                        
                    </>
                }
                {rankingData.length > 0 &&
                    <>
                        <h2>Total Teams Beaten vs. Estimated Teams Beaten Based On Record</h2>
                        <p>This chart shows each team's total teams beaten (the sum of the graph above) versus an estimated total of a team with their record. Every win is estimated as beating {Math.floor(teams.length / 10 * 6.75)} teams and every loss is estimated as beating {Math.floor(teams.length / 10 * 3.25)} teams.</p>
                        <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={rankingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="points" name="Total Teams Beaten" fill={ACCENT_COLOR} />
                            <Bar dataKey="projected" name="Estimated Teams Beaten" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart>
                    </>
                }      
                {scoresPerPosition.length > 0 &&
                    <>
                        {Object.keys(PositionId).map((position) => {
                            const data = formatPointsPerPosition(teams, scoresPerPosition, PositionId[position]);
                            const height = Number(data[data.length - 1].points) + 20;
                            const roundedHeight = Math.ceil(height / 100) * 100;
                            return <>
                                <h2>Total Points Scored By {position}</h2>
                                <BarChart width={graphWidth} height={DEFAULT_HEIGHT} data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, roundedHeight]}/>
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="points" name={`Points Scored By ${position}`} fill={ACCENT_COLOR} />
                                </BarChart>                                
                            </>
                        })}
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
                        points: score.home.totalPoints,
                        result: getResultType(score.winner, true)
                    });
                }
                if (score.away) {
                    scorePerWeek[week].push({
                        teamId: score.away.teamId,
                        points: score.away.totalPoints,
                        result: getResultType(score.winner, false)
                    });
                }
            });
        }
        return scorePerWeek;
    }

    function getResultType(winner, isHome) {
        if (winner === "UNDECIDED") {
            return ResultOptions.Other;
        }

        if (winner === "HOME") {
            if (isHome) {
                return ResultOptions.Win;
            } else {
                return ResultOptions.Loss;
            }
        }

        if (winner === "AWAY") {
            if (!isHome) {
                return ResultOptions.Win;
            } else {
                return ResultOptions.Loss;
            }
        }
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
            scoresByWeek[week].sort((a, b) => a.points - b.points); //we sort by lowest points first, therefore those later in the list beat the most people

            for (let index = 0; index < scoresByWeek[week].length; index++) {
                const teamWeekScore = scoresByWeek[week][index];
                const teamId = teamWeekScore.teamId;

                rankingScores[week].push({
                    teamId: teamId,
                    points: index,
                    result: teamWeekScore.result
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

    function getDifferenceInProjectedVsScoredByWeek(scoresByWeek, projectedScoresByWeek) {
        const data = [];

        for (let index = 0; index < scoresByWeek.length; index ++) {
            const weekData = {};
            const weekScore = scoresByWeek[index];
            const projectedScore = projectedScoresByWeek[index];

            Object.keys(weekScore).forEach(team => {
                const teamScore = Number(weekScore[team]);
                if (!Number.isNaN(teamScore) && projectedScore) {
                    const weekScoreForTeam = teamScore;
                    const projectedScoreForTeam = Number(projectedScore[team]);
                    const difference = weekScoreForTeam - projectedScoreForTeam;
                    weekData[team] = Number(difference.toFixed(2));
                }                   
            });

            weekData.name = weekScore.name;
            data.push(weekData);
        }            

        return data;
    }

    function getProjectedVsScoredData(teams, scoresByWeek, projectedScoresByWeek, totalWeeks) {
        const data = [];
        const buggedThreshold = 31; //some projection weeks got bugged, so we're trying to remove bad data with this
        teams.forEach(team => {
            const teamScores = scoresByWeek.flat().filter(score => score.teamId === team.id);
            let validScoredWeeks = 0; 
            const scoredPoints = teamScores.reduce((accumulator, currentValue) => {
                if (currentValue.points < buggedThreshold) {
                    return accumulator; 
                }

                validScoredWeeks++;
                return accumulator + currentValue.points;
            }, 0);
            
            const teamProjectedScores = projectedScoresByWeek.flat().filter(score => score.teamId === team.id);
            let validProjectedWeeks = 0;
            const projectedPoints = teamProjectedScores.reduce((accumulator, currentValue) => {
                if (currentValue.points < buggedThreshold) {
                    return accumulator; 
                }
                
                validProjectedWeeks++;
                return accumulator + currentValue.points;
            }, 0);
    
            data.push({
                "name": team.name,
                "projected": (projectedPoints / validProjectedWeeks).toFixed(2),
                "scored": (scoredPoints/ validScoredWeeks).toFixed(2)
            });
        });

        data.sort((a, b) => a.scored - b.scored);
        return data;
    }

    function getOpponentProjectedVsScoredData(teams, matchups, scoresByWeek, projectedScoresByWeek) {
        const data = [];

        if (projectedScoresByWeek.length <= 0) {
            return data;
        }
        
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
            const weekWinners = [];
            const weekLosers = [];

            weekNumber++;
            weekData["name"] = "Week " + weekNumber;
            teams.forEach(team => {
                const teamInfo = week.filter(rank => rank.teamId === team.id);
                weekData[team.name] = teamInfo[0].points;

                if (teamInfo[0].result === ResultOptions.Win) {
                    weekWinners.push(team.name);
                } else if (teamInfo[0].result === ResultOptions.Loss) {
                    weekLosers.push(team.name);
                }
            });

            weekData.winners = weekWinners;
            weekData.losers = weekLosers;

            data.push(weekData);
        });

        return data;
    }

    function getPointsScoredPerPosition(teams, rosters, lastWeek) {
        const projectedScores = [];
        teams.forEach(team => {
            const teamRosters = rosters.filter(roster => roster?.id === team.id);
            let weekId = 1;       
            const teamId = team.id;
            projectedScores[teamId] = [];   
            teamRosters.forEach(roster => {
                if (weekId > lastWeek) {
                    return;
                }
                const teamScores = projectedScores[teamId];
                roster.roster.entries.forEach(entry => {
                    if (!teamScores[entry.lineupSlotId]) {
                        teamScores[entry.lineupSlotId] = 0;
                    }

                    const pointsScored = entry.playerPoolEntry.player.stats.find(stat => stat.scoringPeriodId === weekId && stat.statSourceId === 0);

                    teamScores[entry.lineupSlotId] += pointsScored?.appliedTotal ?? 0; 
                });

                weekId++;
            });
        });

        return projectedScores;
    }

    function formatPointsPerPosition(teams, pointsPerPosition, targetPosition) {
        const data = [];
        teams.forEach(team => {
            data.push({
                "name": team.name,
                "points": pointsPerPosition[team.id][targetPosition].toFixed(2),
            });
        });

         data.sort((a, b) => a.points - b.points);

        return data;
    }
}