import axios from 'axios';

//documentation at http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/
const ApiViews = Object.freeze({
    BoxScore: "mBoxscore",
    Roster: "mRoster",
    Settings: "mSettings",
    Scoreboard: "mScoreboard",
    Matchup: "mMatchup",
    MatchupScore: "mMatchupScore",
    DraftDetail: "mDraftDetail",
    Status: "mStatus",
    Teams: "mTeam",
    Transactions: "mTransactions2",
});

export const storedInfo = {
    errorMessage: null,
    currentWeek: 0,
    teams: [],
    scores: [],
    rosters: []
};

export const getCurrentInformation = async(currentYear) => {
    const apiUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/1177758424`;
    storedInfo.hasGottenInfo = false;
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
    await getScoreboardInfo(apiUrl).then((scoreResponse) => {
        if(!scoreResponse) {
            storedInfo.errorMessage = "Calling ESPN API failed";
        }

        const scoreboardInfo = scoreResponse.data;
        storedInfo.scores = scoreboardInfo.schedule;
        storedInfo.matchupPeriods = scoreboardInfo.settings.scheduleSettings.matchupPeriods;
        storedInfo.currentWeek = scoreboardInfo.status.currentMatchupPeriod;
        storedInfo.teams = scoreboardInfo.teams;

        getWeeklyRosters(apiUrl, scoreboardInfo.scoringPeriodId).then(results => storedInfo.rosters = results);
        getWeeklyTransactions(apiUrl, scoreboardInfo.scoringPeriodId).then(results => storedInfo.transactions = results);
    }).catch((error) => {
        storedInfo.errorMessage = error.message;
    });   

    return storedInfo;
}

async function getScoreboardInfo(apiURL) {
    return axios
    .get(apiURL, {
        params: {
            "view": [ApiViews.Scoreboard, ApiViews.Matchup, ApiViews.MatchupScore, ApiViews.Teams]
        },
        paramsSerializer: {
            indexes: null 
        }        
    }).catch((error) => {
        console.warn(`ESPN API Returned with : ${error.message}`);
    });
}

async function getWeeklyRosters(apiURL, weeks) {
    const rosters = [];
    const requests = [];
    for (let weekNumber = 1; weekNumber <= weeks + 1; weekNumber++) {
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
            console.warn(`ESPN API Returned with : ${error.message}`);
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

//DRAFT URL: https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/1177758424?view=mDraftDetail&view=mSettings&view=mTeam&view=modular&view=mNav