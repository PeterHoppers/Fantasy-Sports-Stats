export const PositionInfo = (props) => {
    console.log("Props", props);

    const homePlayerScore = getPlayerProjectedScore(props.homePlayer, props.week);
    const awayPlayerScore = getPlayerProjectedScore(props.awayPlayer, props.week);
    return (
        <tr className="matchup__roster-position-info">
            <td className="matchup__roster-home-player">
                <span>{getPlayerName(props.homePlayer)}</span>
            </td>
            <td className="matchup__roster-score">
                <span>{homePlayerScore.actual}</span>
            </td>
            <td className="matchup__roster-position">
                <span>{props.positionName}</span>
            </td>
            <td className="matchup__roster-score">
                <span>{awayPlayerScore.actual}</span>         
            </td>
            <td className="matchup__roster-away-player">
                <span>{getPlayerName(props.awayPlayer)}</span>
            </td>
            
        </tr>
    );
}

function getPlayerName(player) {
    return player.playerPoolEntry.player.fullName;
}

function getPlayerProjectedScore(player, week) {
    const scoreEntries = player.playerPoolEntry.player.stats.filter(stat => stat.scoringPeriodId === week);

    const projectedEntry = scoreEntries.find(entry => entry.statSourceId === 1);
    const actualEntry = scoreEntries.find(entry => entry.statSourceId === 0);

    return {
        projected : projectedEntry.appliedTotal.toFixed(1),
        actual: (actualEntry) ? actualEntry.appliedTotal.toFixed(1) : "--"
    }
}