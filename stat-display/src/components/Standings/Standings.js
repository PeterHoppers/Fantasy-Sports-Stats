import { StandingRow } from "./StandingRow";
import "./Standings.scss";

export const Standings = (props) => {
    const isCurrentStandings = (props.teams[0].currentProjectedRank);
    let organizedStandings = [];
    
    if (isCurrentStandings) {
        organizedStandings = props.teams.sort((a, b) => a.currentProjectedRank - b.currentProjectedRank);
    } else {
        organizedStandings = props.teams.sort((a, b) => a.rankCalculatedFinal - b.rankCalculatedFinal);
    }

    return (
        <>
            {isCurrentStandings 
                ? <h2>Current Standings</h2>
                : <h2>Final Standings</h2>
            }
                
            <table className="standings">
                <thead>
                    <tr>
                        <th className="standings__header-rank">RK</th>
                        <th className="standings__header-name">Team</th>
                        <th scope="col">W</th>                      
                        <th scope="col">L</th>
                    </tr>
                </thead>
                <tbody>                        
                    {organizedStandings && organizedStandings.map(team =>
                        <StandingRow 
                            key = {team.id}
                            name = {team.name}
                            logo = {team.logo}
                            ranking = {(isCurrentStandings) ? team.currentProjectedRank : team.rankCalculatedFinal}
                            record = {team.record.overall}
                        />             
                    )}
                </tbody>
            </table>                    
        </>
            
    );
}