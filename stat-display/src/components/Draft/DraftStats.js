import React from "react";
import { DefaultPositionNames, ACCENT_COLOR, StartingAmountPerPosition, PRIMARY_GRAPH_COLOR } from "../../definitions";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import './DraftStats.scss';
import DraftPick from "./DraftPick";
import { getGraphWidth } from "../../api/graphData";

const PICKS_CHOSEN = 15;

const DraftStats = (props) => {      
    const pickInfos = props.data;
    const isCurrentStandings = !(props.teams[0].rankCalculatedFinal);
    let teams;
    if (isCurrentStandings) { //TODO: Move this to shared logic with the standings
        teams = props.teams.sort((a, b) => a.currentProjectedRank - b.currentProjectedRank);
    } else {
        teams = props.teams.sort((a, b) => a.rankCalculatedFinal - b.rankCalculatedFinal);
    }

    const teamsDraftData = getDraftDataPerTeam(pickInfos, teams);
    const teamAmount = teams.length;
    const overPerformingPicks = getPicksBySleeperValue(pickInfos, teamAmount, PICKS_CHOSEN, true);
    const underPerformingPicks = getPicksBySleeperValue(pickInfos, teamAmount, PICKS_CHOSEN, false);

    const parentElement = document.querySelector(".draft-view__draft-section-holder");
    const graphWidth = getGraphWidth(parentElement);

    return (
        <>
            <section className="draft-view__draft-section-holder">
                <p className="draft-view__draft-stat-description">The following graphs order teams in order of finish, i.e. furthest left finished first and furthest right finished last. Starting positions refer to the top-ranking player of each position needed to start, e.g. one QB, two RBs, two WRs, etc. The Flex position was ignored.</p>
                {teamsDraftData.length > 0 &&
                    <>
                        <h2>Average Position Rank For Draftees</h2>
                        <BarChart width={graphWidth} height={350} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalPositionRanking" name="Average Position Ranking" fill={PRIMARY_GRAPH_COLOR} />
                            <Bar dataKey="startingPositionRanking" name="Average Starting Position Ranking" fill={ACCENT_COLOR} />
                        </BarChart> 
                        <h2>Average Total Rank For Draftees</h2>
                        <BarChart width={graphWidth} height={350} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name"/>
                            <YAxis  domain={[0, 200]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalRank" name="Average Total Ranking" fill={PRIMARY_GRAPH_COLOR} />
                            <Bar dataKey="startingRank" name="Average Total Starting Ranking" fill={ACCENT_COLOR} />
                        </BarChart> 
                        <h2>Total Points Scored By Draftees</h2>
                        <BarChart width={graphWidth} height={350} data={teamsDraftData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="points" name="Total Points Scored" fill={PRIMARY_GRAPH_COLOR} />
                            <Bar dataKey="startingPoints" name="Total Points Scored By Starters" fill={ACCENT_COLOR} />
                        </BarChart> 
                    </>                    
                }
                 <p className="draft-view__draft-stat-description">The following overperforming/underperforming picks were calculated using a simple algorithm that looked at the pick number, the player's total ranking, the player's position, and whether the player would start on an average team in a league with that many teams.</p>
                {overPerformingPicks.length > 0 &&
                    <>                    
                        <h2>Most Overperforming Picks</h2>
                        <div className="draft-view__draft-section">
                        {overPerformingPicks.map(pickInfo => {
                            return <DraftPick key={pickInfo.id} pick={pickInfo}/>
                        })}
                        </div>  
                    </>          
                }
                {underPerformingPicks.length > 0 &&
                    <>                    
                        <h2>Most Underperforming Picks</h2>
                        <div className="draft-view__draft-section">
                        {underPerformingPicks.map(pickInfo => {
                            return <DraftPick key={pickInfo.id} pick={pickInfo}/>
                        })}
                        </div>  
                    </>          
                }
            </section>
        </>
    );
}

function getDraftDataPerTeam(pickInfos, teams) {
    const formattedInfo = [];

    teams.forEach(team => {
        const teamPicks = pickInfos.filter(pick => pick?.teamPicked?.id === team.id);
        const validPicks = teamPicks.filter(pick => pick?.playerRatings.totalRanking);
        const validPickAmount = validPicks.length;
        const startingPicks = getStartingTeam(validPicks);
        const startingAmount = startingPicks.length;

        const {totalRanking, scoredPoints, totalPositionRanking} = getTotalsFromPicks(validPicks);
        const startingStats = getTotalsFromPicks(startingPicks);
        const startingPoints = startingStats.scoredPoints;
        const startingTotalRanking = startingStats.totalRanking;
        const startingPositionRanking = startingStats.totalPositionRanking;        

        formattedInfo.push({
            picks: teamPicks,
            name: team.name,
            points: scoredPoints.toFixed(2),
            startingPoints: startingPoints.toFixed(2),
            totalRank: (totalRanking / validPickAmount).toFixed(1),
            startingRank: (startingTotalRanking / startingAmount).toFixed(1),
            totalPositionRanking: (totalPositionRanking / validPickAmount).toFixed(1),            
            startingPositionRanking: (startingPositionRanking / startingAmount).toFixed(1)
        });
    });

    return formattedInfo;
}

function getStartingTeam(teamsPicks) {
    const totalStartingPlayers = [];
    teamsPicks.sort((a, b) => a.playerRatings.totalRanking - b.playerRatings.totalRanking);

    Object.keys(DefaultPositionNames).forEach(position => {
        const startingAmount = StartingAmountPerPosition[position];
        const positionPicks = teamsPicks.filter(pick => pick?.playerPosition?.toString() === position);
        const startingPlayers = positionPicks.slice(0, startingAmount);
        totalStartingPlayers.push(...startingPlayers);
    })

    return totalStartingPlayers;
}

function getTotalsFromPicks(picks) {
    const totalRanking = picks.reduce((accumulator, currentValue) => accumulator + currentValue.playerRatings.totalRanking, 0);
    const scoredPoints = picks.reduce((accumulator, currentValue) => accumulator + currentValue.playerRatings.totalRating, 0);
    const totalPositionRanking = picks.reduce((accumulator, currentValue) => accumulator + currentValue.playerRatings.positionalRanking, 0);

    return {
        totalRanking: totalRanking,
        scoredPoints: scoredPoints,
        totalPositionRanking: totalPositionRanking
    }
}

function getPicksBySleeperValue(picks, teamsAmount, amount, isFront) {
    const validPicks = picks.filter(x => x.playerInfo);
    validPicks.sort((a, b,) => calcOffsetPickValue(b, teamsAmount) - calcOffsetPickValue(a, teamsAmount));

    if (isFront) {
        return validPicks.slice(0, amount);
    } else {
        return validPicks.slice(amount * -1).reverse();
    }
}

function calcOffsetPickValue(pick, teamAmount) {
    const totalRanking = (pick?.playerRatings?.totalRanking) ? pick?.playerRatings?.totalRanking : 1000;
    const positionRanking = (pick?.playerRatings?.positionalRanking) ? pick?.playerRatings?.positionalRanking : 1000;
    const pointsScored = (pick?.playerRatings?.totalRating) ? pick?.playerRatings?.totalRating : 0;
    const pickNumber = pick.id;
    const startingAmountOfSaidPosition = StartingAmountPerPosition[pick?.playerPosition?.toString()];
    let baseValue = pickNumber - totalRanking + (pointsScored / 10);

    if (totalRanking <= 10 && pickNumber >= 25) {
        baseValue += 20;
    }
    
    if (positionRanking <= teamAmount * startingAmountOfSaidPosition) {
        baseValue += 50; //if they would start, give that a bonus
    } else if (positionRanking <= teamAmount * startingAmountOfSaidPosition * 2) {
        if (pick?.playerPosition === 1) {
            baseValue -= 75;
        } else if (startingAmountOfSaidPosition >= 2) {
            baseValue += 35;
        }
    } else {
        if (pick?.playerPosition === 1) {
            baseValue -= 100;
        }
    }
    
    if (startingAmountOfSaidPosition === 1) {
        if (pick?.playerPosition === 1) {
            if (pickNumber < 75) {
                baseValue -= 75;
            } else {
                baseValue -= 40;
            }
        } else {
            baseValue += 25;
        }
    }

    if (pickNumber - totalRanking < 35) {
        baseValue *= .1;
    }

    if (!pick?.playerRatings?.totalRating) {
        baseValue -= 500; //if they scored no points, then yeah, they really underperformed
    } else if (pick.playerRatings.totalRating < 0){
        baseValue -= 1000; //if they scored less than 0 points, wow, impressive
    }

    return baseValue * startingAmountOfSaidPosition;
}

export default DraftStats;