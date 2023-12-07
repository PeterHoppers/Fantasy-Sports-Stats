const Pages = Object.freeze({
    Home: "Scoreboard",
    Schedule: "Schedule",
    Standings: "Standings",
    Analysis: "Analysis",
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
    "SLIM": {
        "primary": "#15c2f1",
        "secondary": "#1554f1"
    },
    "T2": {
        "primary": "#f14415",
        "secondary": "#ffff00"
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
    }
  };

export {
    Pages,
    PositionId,
    PositionNames,
    TeamColors
};