import draft2021 from './../LeagueInfo/DraftInfo/draft-2021.json';
import draft2022 from './../LeagueInfo/DraftInfo/draft-2022.json';
import draft2023 from './../LeagueInfo/DraftInfo/draft-2023.json';
import draft2024 from './../LeagueInfo/DraftInfo/draft-2024.json';

export function getDraftData(year) {
    if (!year) {
        return;
    }
    
    switch (year.toString()) {
        case "2021":
            return draft2021;
        case "2022":
            return draft2022;
        case "2023":
            return draft2023;
        case "2024":
            return draft2024;
        default:
            return;
    }
}