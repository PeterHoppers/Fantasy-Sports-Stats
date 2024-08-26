const Pages = Object.freeze({
    Home: "Home",
    Schedule: "Schedule",
    Analysis: "Analysis",
    Draft: "Draft",
    Transactions: "Transactions",
});

const PositionId = {
    QB: 0,
    RB: 2,
    WR: 4,
    TE: 6,
    Flex: 23,
    Defense: 16,
    Kicker: 17,
    Bench: 20,
};

const PositionNames= {
    0: "QB",
    2: "RB",
    4: "WR",
    6: "TE",
    16: "D/ST",
    17: "K",
    20: "Bench",
    23: "Flex"
};

const DefaultPositionNames = {
    0: "N/A",
    1: "QB",
    2: "RB",
    3: "WR",
    4: "TE",
    5: "K",
    16: "D/ST"
};

const StartingAmountPerPosition = Object.freeze({
    1: 1,
    2: 2,
    3: 2,
    4: 1,
    5: 1,
    16: 1
});

const DraftFormat = Object.freeze({
    Round: "Round",
    Team: "Team",    
    PositionPick: "Position then Pick #",
    PositionRank: "Position then Rank #"
});

const TransactionFormat = Object.freeze({
    Week: "Week",
    Team: "Team"
});

const DraftView = Object.freeze({
    Overview: "Overview",
    Stats: "Stats"
});

const TransactionView = Object.freeze({
    AddDrop: "Adds/Drops",
    Stats: "Stats"
});

const TeamColors = {
    "LUNA": {
        "primary": "#f1b215",
        "secondary": "#fefefe"
    },
    "TRC": {
        "primary": "#021912",
        "secondary": "#2effea"
    },
    "FUNK": {
        "primary": "#b215f1",
        "secondary": "#b2b2b2"
    },
    "JAZZ": {
        "primary": "#cdc307",
        "secondary": "#b2b2b2"
    },
    "HWDY": {
        "primary": "#610a00",
        "secondary": "#b2b2b2"
    },
    "SLIM": {
        "primary": "#15c2f1",
        "secondary": "#1554f1"
    },
    "T2": {
        "primary": "#f14415",
        "secondary": "#ffff00"
    },
    "ZRBA": {
        "primary": "#f14415",
        "secondary": "#ffff00"
    },
    "SQRT": {
        "primary": "#9b4b51",
        "secondary": "#fdb627"
    },
    "BS": {
        "primary": "#009a9a",
        "secondary": "#006767"
    },
    "WFT": {
        "primary": "#006700",
        "secondary": "#676700"
    },
    "GFGB": {
        "primary": "#f3a66a",
        "secondary": "#00bfff"
    },
    "BUNN": {
        "primary": "#fc69a4",
        "secondary": "#fefefe"
    },
    "BULA": {
        "primary": "#e47e67",
        "secondary": "#b16300"
    },
    "ADD": {
        "primary": "#610a00",
        "secondary": "#d09251"
    },
    "TD#1": {
        "primary": "#000643",
        "secondary": "#31fcff"
    },
    "RIBT": {
        "primary": "#1554f1",
        "secondary": "#000000"
    },
    "HOS": {
        "primary": "#9ec8cf",
        "secondary": "#4d6869"        
    },
    "LZBZ": {
        "primary": "#65a843",
        "secondary": "#000000"
    },
    "TBD": {
        "primary": "#8bc992",
        "secondary": "#494949"
    },
    "LD": {
        "primary": "#89cff0",
        "secondary": "#FFFFFF"
    },
    "SM": {
        "primary": "#e97451",
        "secondary": "#90ee90"
    },
    "DL" : {
        "primary": "#1e1e1e",
        "secondary": "#1e90ff"
    },
    "Default": {
        "primary": "#f26722",
        "secondary": "#FFFFFF"
    }
};

const LAST_REGULAR_SEASON_WEEK = 14;
const ACCENT_COLOR = "#c07b00";
const PRIMARY_GRAPH_COLOR = "#00338d";

export {
    Pages,
    PositionId,
    PositionNames,
    DefaultPositionNames,
    StartingAmountPerPosition,
    TransactionFormat,
    DraftFormat,
    TransactionView,
    DraftView,
    TeamColors,
    LAST_REGULAR_SEASON_WEEK,
    ACCENT_COLOR,
    PRIMARY_GRAPH_COLOR
};