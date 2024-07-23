import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header";

import { Scoreboard } from "../components/Scoreboard/Scoreboard";
import { Standings } from "../components/Standings/Standings";

import "./home.scss";

export const Home = (props) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const currentScores = props.info.scores.filter(score => score.matchupPeriodId === props.info.currentWeek);
        setScores(currentScores);
    }, [props]);

    return (
        <>
            <Header message={"Welcome to the CUFFL!"} hasLink={true}/>
            <main className="home-view__main">
                <section className="home__standings">                    
                    <div className="home__standings-preview">
                       <Standings
                            teams = {props.info.teams}
                        />
                    </div>
                </section>
                <Scoreboard 
                    week = {props.info.currentWeek}
                    scores = {scores}
                    teams = {props.info.teams}
                    onClickScoreDisplay = {props.triggerMatchup}
                />
            </main>
        </>
        
    );
}