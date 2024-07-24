const Pages = Object.freeze({
    Home: "Home",
    Schedule: "Schedule",
    Analysis: "Analysis",
    Draft: "Draft"
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
    1: "QB",
    2: "RB",
    3: "WR",
    4: "TE",
    5: "K",
    16: "D/ST"
};

const DraftFormat = Object.freeze({
    Round: "Round",
    Team: "Team",    
    PositionPick: "Position then Pick #",
    PositionRank: "Position then Rank #"
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
    "Default": {
        "primary": "#f26722",
        "secondary": "#FFFFFF"
    }
  };

export {
    Pages,
    PositionId,
    PositionNames,
    DefaultPositionNames,
    DraftFormat,
    TeamColors
};