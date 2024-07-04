import axios from 'axios';
import fs from 'fs';
import { leagueId, testPublicId, s2, swid} from '../secrets/secrets.js';

const ApiViews = Object.freeze({
    BoxScore: "mBoxscore",
    Roster: "mRoster",
    Settings: "mSettings",
    Scoreboard: "mScoreboard",
    Matchup: "mMatchup",
    MatchupScore: "mMatchupScore",
    Teams: "mTeam",
});

//documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
const storedInfo = {
    currentWeek: 0,
    teams: [],
    scores: [],
    rosters: []
};

const testYear = 2021;
const targetDestination = `Football 2023/Fantasy-Sports-Stats/stat-display/src/LeagueInfo/info-${testYear}.json`;
const apiUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${testYear}/segments/0/leagues/${leagueId}`;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
const scoreboardInfo = await getScoreboardInfo(apiUrl);
storedInfo.scores = scoreboardInfo.schedule;
storedInfo.matchupPeriods = scoreboardInfo.settings.scheduleSettings.matchupPeriods;
storedInfo.currentWeek = scoreboardInfo.status.currentMatchupPeriod;
storedInfo.teams = scoreboardInfo.teams;

//const boxscoreInfo = await getBoxscoreInfo(apiUrl);
storedInfo.rosters = await getWeeklyRosters(apiUrl, scoreboardInfo.scoringPeriodId);

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