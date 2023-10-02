export const PointTotal = (props) => {
    const isLive = (props.scoreInfo.totalProjectedPointsLive);
    return (
        <section className="matchup__point-total">
            {isLive 
                ?
                <>
                    <p className="matchup__point-current">{props.scoreInfo.totalPointsLive.toFixed(1)}</p>
                    <p className="matchup__point-live">{props.scoreInfo.totalProjectedPointsLive.toFixed(1)}</p>
                </>                    
                :
                    <p className="matchup__point-current">{props.scoreInfo.totalPoints.toFixed(1)}</p>
            }
        </section>
    );
}