import axios from 'axios';

const ApiViews = Object.freeze({
    BoxScore: "mBoxscore",
    Roster: "mRoster",
    Settings: "mSettings",
    Scoreboard: "mScoreboard",
    Matchup: "mMatchup",
    MatchupScore: "mMatchupScore",
    Teams: "mTeam"
});

//documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
const storedInfo = {
    currentWeek: 0,
    teams: [],
    scores: [],
    rosters: []
};

export const getCurrentInformation = async(currentYear) => {
    const apiUrl = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/1177758424`;
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
    const scoreboardInfo = await getScoreboardInfo(apiUrl);
    storedInfo.scores = scoreboardInfo.schedule;
    storedInfo.matchupPeriods = scoreboardInfo.settings.scheduleSettings.matchupPeriods;
    storedInfo.currentWeek = scoreboardInfo.status.currentMatchupPeriod;
    storedInfo.teams = scoreboardInfo.teams;
    
    //const boxscoreInfo = await getBoxscoreInfo(apiUrl);
    storedInfo.rosters = await getWeeklyRosters(apiUrl, scoreboardInfo.scoringPeriodId);

    return storedInfo;
}

async function getScoreboardInfo(apiURL) {
    let scoreboardInfo;
    await axios
    .get(apiURL, {
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
    for (let weekNumber = 1; weekNumber <= weeks; weekNumber++) {
        requests.push(axios
        .get(apiURL, {
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