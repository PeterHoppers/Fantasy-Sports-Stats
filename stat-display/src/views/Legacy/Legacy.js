import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from 'recharts';
import Header from "../../components/Header/Header";
import { NameOfOwnerGuid } from "../../definitions";
import { ACCENT_COLOR, PRIMARY_GRAPH_COLOR } from "../../definitions";
import TeamLineGraph from "../../components/TeamLineGraph/TeamLineGraph";
import { getGraphWidth } from "../../api/graphData";

import "./legacy.scss";

const DRAFT_DAY_RANK = "draftDayRank";
const FINISHED_RANK = "finalRank";

export const Legacy = (props) => {
    const teamsByOwner = {};
    const extraYearInfo = {};
    props.yearInfos.forEach(yearInfo => {
        const teamsPerYear = yearInfo.info.teams;
        extraYearInfo[yearInfo.year] = {
            teamNumber: yearInfo.info.teams.length,
            playedWeeks: getNumberOfRegularSeasonWeeksSoFar(yearInfo.info.scores)
        };

        teamsPerYear.forEach(team => {
            const ownerGuid = team.primaryOwner;
            if (!teamsByOwner[ownerGuid]) {
                teamsByOwner[ownerGuid] = {
                    name: NameOfOwnerGuid[ownerGuid],
                    teams: []
                };
            }

            team.year = yearInfo.year;
            teamsByOwner[ownerGuid].teams.push(team);
        });
    });

    const ownerNames = [];
    Object.values(teamsByOwner).forEach(owner => {
        ownerNames.push({
            name: owner.name,
            abbrev: owner.teams[0].abbrev,
        })
    });
    
    const ownersRecordInfo = getOwnerTotalRecords(teamsByOwner, extraYearInfo);
    const averagePointsForAgainst = ownersRecordInfo.slice(0);
    averagePointsForAgainst.sort((a, b) => a.averagePointsFor - b.averagePointsFor);

    const draftRankPerYear = getOwnerRankPerYear(teamsByOwner, extraYearInfo, DRAFT_DAY_RANK);
    const finishedRankPerYear = getOwnerRankPerYear(teamsByOwner, extraYearInfo, FINISHED_RANK);
    const averageRanksOfOwners = getOwnerAverageRank(teamsByOwner, extraYearInfo);
    averageRanksOfOwners.sort((a, b) => a.averageDraftRank - b.averageDraftRank);
    const validAverageFinishedRankOfOwners = averageRanksOfOwners.filter(x => !isNaN(x.averageFinishedRank));
    validAverageFinishedRankOfOwners.sort((a, b) => a.averageFinishedRank - b.averageFinishedRank);

    const graphWidth = getGraphWidth();

    const percentageRender = (value, name, props) => {
        return `${(value * 100).toFixed(1)}%`;
    }

    const rankFormatter = (value, name, props) => {
        const teams = props.payload.teamCount;
        const formattedValue = convertDecimalRankIntoWholeNumber(teams, value);
        return `${value} (#${formattedValue})`;
    }

    return (
        <>
            <Header message="Legacy Stats"/>
            <main className="legacy-view__main">   
                {ownersRecordInfo.length > 0 &&
                    <>
                        <h2>Win Percentage</h2>
                        <BarChart width={graphWidth} height={350} data={ownersRecordInfo}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis/>
                            <Tooltip formatter={percentageRender}/>
                            <Legend />
                            <Bar dataKey="averageWinPercentage" name="Win Percentage" fill={ACCENT_COLOR} />
                        </BarChart> 
                    </>                    
                }           
                {averagePointsForAgainst.length > 0 &&
                    <>
                        <h2>Average Points Scored Per Game vs. Average Points Against Per Game</h2>
                        <BarChart width={graphWidth} height={350} data={averagePointsForAgainst}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averagePointsFor" name="Average Points For" fill={ACCENT_COLOR} />
                            <Bar dataKey="averagePointsAgainst" name="Average Points Against" fill={PRIMARY_GRAPH_COLOR} />
                        </BarChart> 
                    </>                    
                }
                {finishedRankPerYear.length > 0 &&
                    <>
                        <h2>Final Rank By Year</h2>
                        <p>Rankings have been converted to a scale of 0 - 1, with 0 being last place and 1 being first place. This helps average out the differing amount of players between years.</p>
                        <TeamLineGraph graphWidth={graphWidth} data={finishedRankPerYear} teamData={ownerNames} min={0} max={1} customFormatter={rankFormatter}/>
                    </>
                }
                {validAverageFinishedRankOfOwners.length > 0 &&
                    <>
                        <h2>Average Final Rank</h2>
                        <BarChart width={graphWidth} height={350} data={validAverageFinishedRankOfOwners}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageFinishedRank" name="Average Final Ranking" fill={ACCENT_COLOR} />
                        </BarChart> 
                    </>                    
                }  
                {draftRankPerYear.length > 0 &&
                    <>
                        <h2>Draft Day Projected Rank by Year</h2>
                        <TeamLineGraph graphWidth={graphWidth} data={draftRankPerYear} teamData={ownerNames} min={0} max={1} customFormatter={rankFormatter}/>
                    </>
                }
                {averageRanksOfOwners.length > 0 &&
                    <>
                        <h2>Average Projected Rank</h2>
                        <BarChart width={graphWidth} height={350} data={averageRanksOfOwners}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageDraftRank" name="Average Projected Ranking" fill={ACCENT_COLOR} />
                        </BarChart> 
                    </>                    
                }
            </main>
        </>
    );
}

function getOwnerRankPerYear(teamsByOwner, yearSpecificStats, nameOfRank) {
    const data = [];
    const ownerRankingData = getOwnerRankings(teamsByOwner, yearSpecificStats);    
    //loop through all the years
    Object.keys(yearSpecificStats).forEach(year => {
        const dataName = year;
        const teamData = {};
        //grab the corresponding stat and name from each of the owner rankings
        ownerRankingData.forEach(ownerRanking => {
            const rankingInfo = ownerRanking.ownerRanks.find(x => x.year.toString() === year.toString());            
            if (rankingInfo && rankingInfo[nameOfRank] <= 1) {
                teamData[ownerRanking.name] = Number(rankingInfo[nameOfRank].toFixed(3));
            }
        });        
       
        if (Object.keys(teamData).length > 0) {
            data.push({
                name: dataName,
                teamCount: yearSpecificStats[year].teamNumber,
                ...teamData
            });
        }       
    });

    return data;
}

function getOwnerAverageRank(teamsByOwner, yearSpecificStats) {
    const data = [];
    const ownerRankingData = getOwnerRankings(teamsByOwner, yearSpecificStats);

    for (const ownerGuid in teamsByOwner) {
        const ownerData = ownerRankingData.find(x => x.ownerGuid === ownerGuid);
        const ownerRanks = ownerData.ownerRanks;
        const averageDraftRank = getAverageAmountStat(ownerRanks, DRAFT_DAY_RANK);
        const finishedRankings = ownerRanks.filter(x => x.unCalcFinalRank > 0);
        const averageFinishedRank = getAverageAmountStat(finishedRankings, FINISHED_RANK);

        data.push({
            "name": ownerData.name,
            "averageDraftRank": Number(averageDraftRank.toFixed(3)),
            "averageFinishedRank": Number(averageFinishedRank.toFixed(3)),
        });       
    }

    return data;
}

function getOwnerRankings(teamsByOwner, yearSpecificStats) {
    const data = [];
    for (const ownerGuid in teamsByOwner) {
        const ownerInfo = teamsByOwner[ownerGuid];
        const ownerTeams = ownerInfo.teams;
        const ownerRanks = [];
        ownerTeams.forEach(team => {
            const teamsInYear = yearSpecificStats[team.year].teamNumber;
            ownerRanks.push({
                [DRAFT_DAY_RANK]: convertRankingIntoDecimal(teamsInYear, team.draftDayProjectedRank), //translates the position of 1 - team number into 1 - 0, where 1 is first and 0 is last
                unCalcFinalRank: team.rankCalculatedFinal,
                [FINISHED_RANK]: convertRankingIntoDecimal(teamsInYear, team.rankCalculatedFinal),
                year: team.year
            });            
        });

        data.push({
            "ownerGuid": ownerGuid,
            "name": ownerInfo.name,
            "ownerRanks": ownerRanks
        });
    }

    return data;
}

function getOwnerTotalRecords(teamsByOwner, yearSpecificStats) {
    const data = [];
    for (const ownerGuid in teamsByOwner) {
        const ownerInfo = teamsByOwner[ownerGuid];
        const ownerTeams = ownerInfo.teams;
        const ownerRecordsInfo = [];
        ownerTeams.forEach(team => {
            if (team.points > 0) {
                ownerRecordsInfo.push({
                    year: team.year,
                    overallRecord: team.record.overall
                });
            }
        });

        if (ownerRecordsInfo.length > 0) {
            let totalGamesPlayed = 0; //got to do this weird stuff here to handle bye weeks
            ownerRecordsInfo.forEach(record => {
                totalGamesPlayed += yearSpecificStats[record.year].playedWeeks;
            });

            const ownerRecords = Array.from(ownerRecordsInfo, (records) => records.overallRecord);
            const totalWins = getTotalAmountStat(ownerRecords, "wins");
            const totalLosses = getTotalAmountStat(ownerRecords, "losses");
            const averageWinPercentage = totalWins / (totalWins + totalLosses);
            const totalPointsFor = getTotalAmountStat(ownerRecords, "pointsFor");
            const averagePointsFor = totalPointsFor / totalGamesPlayed;
            const totalPointsAgainst = getTotalAmountStat(ownerRecords, "pointsAgainst");
            const averagePointsAgainst = totalPointsAgainst / totalGamesPlayed;
    
            data.push({
                "name": ownerInfo.name,
                "averageWinPercentage": Number(averageWinPercentage.toFixed(3)),
                "averagePointsFor": Number(averagePointsFor.toFixed(2)),
                "averagePointsAgainst" : Number(averagePointsAgainst.toFixed(2)),
            });
        }        
    }

    data.sort((a, b) => a.averageWinPercentage - b.averageWinPercentage);
    return data;
}

function getAverageAmountStat(listOfStat, stat) {
    const totalStat = getTotalAmountStat(listOfStat, stat);
    return totalStat / listOfStat.length;
}

function getTotalAmountStat(listOfStat, stat) {
    return listOfStat.reduce((accumulator, currentValue) => accumulator + currentValue[stat], 0);
}

function getNumberOfRegularSeasonWeeksSoFar(scores) {
    const regularSeasonGamesScheduled = scores.filter(score => score.playoffTierType === "NONE");
    const nonByeRegularSeasonGames = regularSeasonGamesScheduled.filter(score => score.away);
    const playedRegularSeasonGames = nonByeRegularSeasonGames.filter(score => score.winner !== "UNDECIDED");

    if (playedRegularSeasonGames.length === 0) {
        return 0;
    }

    return playedRegularSeasonGames[playedRegularSeasonGames.length - 1].matchupPeriodId;
}

function convertRankingIntoDecimal(teamsInYear, rank) {
    return (teamsInYear - rank) / (teamsInYear - 1);
}

function convertDecimalRankIntoWholeNumber(teamsInYear, decimalRank) {
    return Math.round(teamsInYear - ((teamsInYear - 1) * decimalRank)); 
}
