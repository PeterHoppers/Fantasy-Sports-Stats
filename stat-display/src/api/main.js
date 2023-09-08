//import pkg from 'espn-fantasy-football-api/node.js'; // node
import axios from 'axios';
import { leagueId, testPublicId, s2, swid} from '../secrets/secrets.js';

export async function getLeagueInfo() {
    //documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
    const storedInfo = {
        teams: [],
        scores: [],
        rosters: []
    };

    const testYear = 2022;
    const apiUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${testYear}/segments/0/leagues/${leagueId}`;

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
    storedInfo.teams = await getTeamsInfo(apiUrl);
    storedInfo.scores = await getScoreInfo(apiUrl);
    storedInfo.rosters = await getWeeklyRosters(apiUrl, 19);

    return storedInfo;
}

async function getTeamsInfo(apiURL) {
    let teams;
    await axios
    .get(apiURL, {
        headers: {
            Cookie: `swid=${swid}; espn_s2=${s2}`,
        },
        params: {
            "view": "mBoxscore"
        },
    })
    .then((response) => {
        console.info("Successfully fetched league endpoint");
        teams = response.data.teams;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    return teams;
}

async function getScoreInfo(apiURL) {
    let scores;
    await axios
    .get(apiURL, {
        headers: {
            Cookie: `swid=${swid}; espn_s2=${s2}`,
        },
        params: {
            "view": "mBoxscore"
        },
    })
    .then((response) => {
        console.info("Successfully fetched league endpoint");
        scores = response.data.schedule;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    return scores;
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
                "view": "mRoster",
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