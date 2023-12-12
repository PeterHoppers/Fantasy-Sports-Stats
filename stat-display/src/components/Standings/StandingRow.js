export const StandingRow = (props) => {
    return (
        <>
            <tr className="standings__standing-row">
                <td className="standings__standing-rank">
                    <span>{props.ranking}</span>
                </td>
                <td className="standings__standing-logo">
                    <div className="standings__standing-logo-holder">
                        <img src={props.logo} alt="Logo"/>
                    </div>                    
                </td>
                <td className="standings__standing-name">
                    <span>{props.name}</span>
                </td>
                <td className="standings__standing-wins">
                    <span>{props.record.wins}</span>
                </td>
                <td className="standings__standing-loses">
                    <span>{props.record.losses}</span>
                </td>         
            </tr>
        </>
    )
};