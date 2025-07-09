const Pages = Object.freeze({
    Home: "Home",
    Schedule: "Schedule",
    Analysis: "Analysis",
    Draft: "Draft",
    Transactions: "Transactions",
    Legacy: "Legacy"
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

const DefaultPositionNames = { //this is different ids due to player's positions and positions in the lineup being different
    0: "N/A",
    1: "QB",
    2: "RB",
    3: "WR",
    4: "TE",
    5: "K",
    16: "D/ST"
};

const DefaultPositionColors = { 
    1: "#ff993333",
    2: "#ff333333",
    3: "#3399ff33",
    4: "#33cc3333",
    5: "#99660033",
    16: "#e0e0eb44"
}

const StartingAmountPerPosition = Object.freeze({
    1: 1,
    2: 2.5,
    3: 2.5,
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

const ResultOptions = Object.freeze({
    Win: "Win",
    Loss: "Loss",
    Other: "Other"
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
        "primary": "#a0522d",
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
    "CBS" : {
        "primary" : "#841B2D",
        "secondary" : "#808080"
    },
    "TT" : {
        "primary" : "#808080",
        "secondary" : "#a0522d"
    },
    "BSHP": {
        "primary": "#cdc307",
        "secondary": "#b2b2b2"
    },
    "PP": {
        "primary": "#3182bd",
        "secondary": "#FFFFFF"
    },
    "Default": {
        "primary": "#f26722",
        "secondary": "#FFFFFF"
    }
};

const NameOfOwnerGuid = Object.freeze({
    "{0D2E536B-00DF-4337-A2BC-1750974EDD92}" : "Riley Fay",
    "{8EF584AC-42DF-4D00-AC89-6D249D41E351}" : "Peter Hoppe-Spindler",
    "{35F2E0A6-2257-4483-833C-91062EB30953}" : "Alexandra Caucutt",
    "{42FA2A26-9A7B-475B-94CC-77B404F46CDA}" : "William Simmons",
    "{353AB6F9-2EE7-43B1-8F0E-0209C6044CCA}" : "Sam Blanchard",
    "{1634A1F6-F832-40CC-B374-F900BC810E75}" : "Analiesa Harbach",
    "{87369FBA-672A-4A27-AA27-FB5318AED0B4}" : "Travis Daniel",
    "{4307015B-8024-4D18-A59C-08A6371E0803}" : "Chris Blanchard",
    "{A616963C-C77E-4923-BB25-F9A9ED60C44A}" : "Millar Minahan",
    "{B412DB76-9693-45C3-92DB-76969375C331}" : "Ryan Liebherr",
    "{B0549EEC-CEAB-4CAF-8E3A-1986ED9BD184}" : "Emily Burke",
    "{C48FED7A-4768-421D-97A0-D98211F04345}" : "Zach Zarb",
    "{D3D47350-4B8E-4134-8C4F-3056D54A109B}" : "Jackson Nickel",
    "{D3027E95-EE6E-4F61-A97B-F5B43B8847BE}" : "Madelyn Hoppe-Spindler",
    "{F6E0C9CD-A4BB-4C5E-84A8-1D56037227B1}" : "Victor Wagner"
});

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
    ResultOptions,
    DefaultPositionColors as PositionColors,
    TeamColors,
    NameOfOwnerGuid,
    LAST_REGULAR_SEASON_WEEK,
    ACCENT_COLOR,
    PRIMARY_GRAPH_COLOR
};