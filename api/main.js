//import pkg from 'espn-fantasy-football-api/node.js'; // node
import axios from 'axios';
import fs from 'fs';
import { leagueId, testPublicId, s2, swid} from '../secrets/secrets.js';

const ApiViews = Object.freeze({
    BoxScore: "mBoxscore",
    Roster: "mRoster",
    Settings: "mSettings",
    Scoreboard: "mScoreboard",
    Matchup: "mMatchup",
    MatchupScore: "mMatchupScore"
});

//documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
const storedInfo = {
    currentWeek: 0,
    teams: [],
    scores: [],
    rosters: []
};

const testYear = 2023;
const targetDestination = `Football 2023/Fantasy-Sports-Stats/stat-display/src/LeagueInfo/info-${testYear}.json`;
const apiUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${testYear}/segments/0/leagues/${leagueId}`;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
const scoreboardInfo = await getScoreboardInfo(apiUrl);
storedInfo.scores = scoreboardInfo.schedule;
storedInfo.currentWeek = scoreboardInfo.status.currentMatchupPeriod;
storedInfo.teams = scoreboardInfo.teams;

//const boxscoreInfo = await getBoxscoreInfo(apiUrl);
storedInfo.rosters = await getWeeklyRosters(apiUrl, storedInfo.currentWeek);

var dictstring = JSON.stringify(storedInfo);
fs.writeFile(targetDestination, dictstring, (err) => err && console.error(err));

async function getBoxscoreInfo(apiURL) {
    let scoreInfo;
    await axios
    .get(apiURL, {
        headers: {
            Cookie: `swid=${swid}; espn_s2=${s2}`,
        },
        params: {
            "view": ApiViews.BoxScore
        },
    })
    .then((response) => {
        console.info("Successfully fetched league endpoint");
        scoreInfo = response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    return scoreInfo;
}

async function getScoreboardInfo(apiURL) {
    let scoreboardInfo;
    await axios
    .get(apiURL, {
        headers: {
            Cookie: `swid=${swid}; espn_s2=${s2}`,
        },
        params: {
            "view": [ApiViews.Scoreboard, ApiViews.Matchup, ApiViews.MatchupScore]
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
    for (let weekNumber = 1; weekNumber <= weeks; weekNumber++) {
        await axios
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
            console.info("Successfully fetched league endpoint");
            rosters[response.data.scoringPeriodId] = response.data.teams;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }
    return rosters;
}



















/*const request = new Request(apiUrl,
    {
        method: "GET"
    });

fetch(request)
  .then((response) => {
    console.log(response.formData);
  });
*/


/*const myClient = new pkg.Client({ leagueId: leagueId });
console.log("Client", myClient);
myClient.setCookies({ espnS2: s2, SWID: swid});
const info = myClient.getBoxscoreForWeek ({
    seasonId: 2023,
    matchupPeriodId: 1,
    scoringPeriodId: 1
});
info.then((finishedInfo) => {
    console.log("Info", finishedInfo);
});*/

/* mScoreboard 
  - schedule
   - who played
   - who won
   - points
  - teams

*/