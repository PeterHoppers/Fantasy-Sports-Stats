const Pages = Object.freeze({
    Home: "Scoreboard",
    Schedule: "Schedule",
    Standings: "Standings"
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

export {
    Pages,
    PositionId,
    PositionNames
};