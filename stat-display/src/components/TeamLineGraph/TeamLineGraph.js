import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { TeamColors } from "../../definitions";
import { useState } from "react";
import './TeamLineGraph.scss';
import { DEFAULT_HEIGHT, FADE_VALUE } from "../../api/graphData";

const TeamLineGraph = (props) => {
    const [hoverLabel, setHoverLabel] = useState(null);
    const [hiddenTeams, setHiddenTeams] = useState([]);
    const [height, setHeight] = useState(350);
    const graphWidth = props.graphWidth;
    const rankingsByWeekData =  props.data;
    const teams = props.teamData;

    const handleLegendMouseEnter = (e) => {
        const hoveredTeam = e.dataKey;

        if (!isTeamHidden(hoveredTeam)) {
            setHoverLabel(e.dataKey); 
        }               
    };

    const handleLegendMouseLeave = (e) => {
        setHoverLabel(null);
    };

    const handleLegendClick = (e) => {
        const clickedTeam = e.dataKey;
        let newTeams;
        if (isTeamHidden(clickedTeam)) {
            newTeams = hiddenTeams.filter((x) => x !== clickedTeam);
            setHiddenTeams(newTeams);
            rerenderGraph(false);
        } else {
            newTeams = hiddenTeams;
            newTeams.push(clickedTeam);
            setHiddenTeams(newTeams);
            rerenderGraph(true);
        }
        setHoverLabel(null);
    }

    const isTeamHidden = (teamName) => {
        return hiddenTeams.includes(teamName);
    }

    const rerenderGraph = (hasHidden) => {
        //in order for the graph to properly update when we hide/show something, we need to modify a property that adjusts how the graph is displayed
        //best way I got is to change the height very slightly. It's real jank, but it works without adding complexity to any other code
        const newHeight = (hasHidden) ? DEFAULT_HEIGHT : DEFAULT_HEIGHT + .000001;
        setHeight(newHeight);
    }

    return (
        <div className="team-line-graph" data-hidden={hiddenTeams.length} data-hover={hoverLabel}>
            {(hiddenTeams !== null) && 
                <LineChart width={graphWidth} height={height} data={rankingsByWeekData} data-hidden={hiddenTeams.length}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[props.min, props.max]}/>
                    {props.customFormatter 
                        ?
                            <Tooltip formatter={props.customFormatter} />
                        :
                            <Tooltip />
                    }
                    
                    <Legend  
                        onMouseOver={handleLegendMouseEnter}
                        onMouseOut={handleLegendMouseLeave}
                        onClick={handleLegendClick}
                    />
                    {
                        teams.map((team, index) => {
                            let strokeColor; 
                            if (team.abbrev) {
                                const teamColor = TeamColors[team.abbrev];
                                if (teamColor) {
                                    strokeColor = teamColor["primary"];
                                }
                            }
                             
                            const isActive = (hoverLabel === team.name || !hoverLabel);
                            if (!isActive) {
                                strokeColor += FADE_VALUE;
                            }
                            const isHidden = isTeamHidden(team.name);

                            return <Line 
                                key={index} 
                                type="monotone" 
                                dataKey={team.name} 
                                hide={isHidden}
                                stroke={strokeColor} 
                                dot={(props.customDotRenderer) ? props.customDotRenderer : {strokeWidth: 2}}
                            />
                        })
                    }
                </LineChart>
            }
            
        </div>
    )
}

export default TeamLineGraph;