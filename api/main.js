import axios from 'axios';
import fs from 'fs';
import { leagueId, testPublicId, chrisS2, chrisSwid,} from '../secrets/secrets.js';
import { ApiViews, EmptyInfo } from './apiDefinitions.js';

const s2 = chrisS2;
const swid = chrisSwid;

//documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
const storedInfo = EmptyInfo;

const targetYear = 2024;
const targetDestination = `./Fantasy-Sports-Stats/stat-display/src/LeagueInfo/info-${targetYear}-new.json`;
const apiUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${targetYear}/segments/0/leagues/${leagueId}`;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
const scoreboardInfo = await getScoreboardInfo(apiUrl);
storedInfo.scores = scoreboardInfo.schedule;
storedInfo.matchupPeriods = scoreboardInfo.settings.scheduleSettings.matchupPeriods;
storedInfo.currentWeek = scoreboardInfo.status.currentMatchupPeriod;
storedInfo.teams = scoreboardInfo.teams;

//const boxscoreInfo = await getBoxscoreInfo(apiUrl);
storedInfo.rosters = await getWeeklyRosters(apiUrl, scoreboardInfo.scoringPeriodId);
storedInfo.transactions = await getWeeklyTransactions(apiUrl, scoreboardInfo.scoringPeriodId);

var dictstring = JSON.stringify(storedInfo);
fs.writeFile(targetDestination, dictstring, (err) => err && console.error(err));

async function getScoreboardInfo(apiURL) {
    let scoreboardInfo;
    await axios
    .get(apiURL, {
        headers: {
            Cookie: `swid=${swid}; espn_s2=${s2}`,
        },
        params: {
            "view": [ApiViews.Scoreboard, ApiViews.Matchup, ApiViews.MatchupScore, ApiViews.Teams]
        },
        paramsSerializer: {
            indexes: null 
        }        
    })
    .then((response) => {
        console.info("Successfully fetched league endpoint");
        scoreboardInfo = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    return scoreboardInfo;
}

async function getWeeklyRosters(apiURL, weeks) {
    const rosters = [];
    const requests = [];
    for (let weekNumber = 1; weekNumber <= weeks + 1; weekNumber++) {
        requests.push(axios
        .get(apiURL, {
            headers: {
                Cookie: `swid=${swid}; espn_s2=${s2}`,
            },
            params: {
                "view": ApiViews.Roster,
                "scoringPeriodId": weekNumber
            },
        })
        .then((response) => {
            rosters[response.data.scoringPeriodId] = response.data.teams;
        })
        .catch(function (error) {
            console.log(error);
        }));
    }
    await axios.all(requests).then(() => {
        console.info("Successfully fetched league endpoint");  
    });
    return rosters;
}

async function getWeeklyTransactions(apiURL, weeks) {
    const transactions = [];
    const requests = [];
    for (let weekNumber = 1; weekNumber <= weeks + 1; weekNumber++) {
        requests.push(axios
        .get(apiURL, {
            headers: {
                Cookie: `swid=${swid}; espn_s2=${s2}`,
            },
            params: {
                "view": ApiViews.Transactions,
                "scoringPeriodId": weekNumber
            },
        })
        .then((response) => {
            transactions[response.data.scoringPeriodId] = response.data.transactions;
        })
        .catch(function (error) {
            console.log(error);
        }));
    }
    await axios.all(requests).then(() => {
        console.info("Successfully fetched league endpoint");  
    });
    return transactions;
}