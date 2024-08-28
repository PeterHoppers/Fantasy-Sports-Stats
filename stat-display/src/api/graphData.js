export const DEFAULT_HEIGHT = 350;
export const FADE_VALUE = "33"; //to add transprency to the colors

export function getGraphWidth(clampingElement) {
    let graphWidth = window.screen.width - 50;
    if (clampingElement) {
        const boundRect = clampingElement.getBoundingClientRect();
        const clampingWidth = boundRect.width;
        graphWidth = (graphWidth > clampingWidth) ? clampingWidth : graphWidth;
    }
    return graphWidth;
}