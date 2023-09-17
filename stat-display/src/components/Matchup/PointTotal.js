export const PointTotal = (props) => {
    const isLive = (props.scoreInfo.totalProjectedPointsLive);
    return (
        <section className="matchup__point-total">
            {isLive 
                ?
                <>
                    <p>{props.scoreInfo.totalPointsLive.toFixed(1)}</p>
                    <p>{props.scoreInfo.totalProjectedPointsLive.toFixed(1)}</p>
                </>                    
                :
                    <p>{props.scoreInfo.totalPoints.toFixed(1)}</p>
            }
        </section>
    );
}