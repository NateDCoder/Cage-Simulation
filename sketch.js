const SCALE = 5;

var chainAngle = degreesToRadians(35);
var cageAngle = degreesToRadians(0);
var robotAngle = degreesToRadians(0);
var robotContactPoint = 1;

const CAGE_WIDTH = 7.375 * SCALE;
const CAGE_HEIGHT = 24 * SCALE;

const ROBOT_WIDTH = 32 * SCALE;
const ROBOT_HEIGHT = 4 * SCALE;

const FLOOR_DISTANCE = 3.5 * SCALE;
const FLOOR_LOCATION = 60 * SCALE;

const CHAIN_LENGTH = (60 * SCALE) - (CAGE_HEIGHT + FLOOR_DISTANCE);
var chainSlider, cageSlider, robotSlider, robotContactSlider;

let gravity = false;
//update plz

// Grab the button element
const gravityButton = document.getElementById('gravity');

// Add an event listener to set the flag when the button is clicked
gravityButton.addEventListener('click', () => {
    gravity = !gravity;
});

function setup() {
    createP('Chain Angle:').position(10, 0);
    createP('Cage Angle:').position(10, 40);
    createP('Robot Angle:').position(10, 80);
    createP('Robot Contact Point:').position(10, 120);
    createCanvas(400, 400);
    chainSlider = createSlider(-90, 90, 0);
    chainSlider.position(10, 30);
    chainSlider.size(80);

    cageSlider = createSlider(-90, 90, 0);
    cageSlider.position(10, 70);
    cageSlider.size(80);

    robotSlider = createSlider(0, 90, 0);
    robotSlider.position(10, 110);
    robotSlider.size(80);

    robotContactSlider = createSlider(0, 1.5, 1, 0);
    robotContactSlider.position(10, 150);
    robotContactSlider.size(80);
}

function draw() {
    chainAngle = degreesToRadians(chainSlider.value());
    cageAngle = degreesToRadians(cageSlider.value());
    robotAngle = degreesToRadians(robotSlider.value());
    robotContactPoint = robotContactSlider.value();
    background(255);
    // The floor
    strokeWeight(0);
    fill(90);
    rect(0, FLOOR_LOCATION, width, height - FLOOR_LOCATION)

    // The chain
    fill(0);
    stroke(0);
    strokeWeight(3);
    beginShape();
    vertex(width / 2, 0);
    let chainPoint = createVector(width / 2 + CHAIN_LENGTH * Math.sin(chainAngle), CHAIN_LENGTH * Math.cos(chainAngle))
    vertex(chainPoint.x, chainPoint.y)
    endShape();

    // The Cage
    noFill();
    stroke(220, 0, 0);
    strokeWeight(3);
    beginShape();
    let p1 = createVector(
        chainPoint.x - CAGE_WIDTH / 2 * Math.cos(cageAngle + chainAngle),
        chainPoint.y + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle));

    let p2 = createVector(
        chainPoint.x + CAGE_WIDTH / 2 * Math.cos(cageAngle + chainAngle),
        chainPoint.y - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle));

    let p3 = createVector(
        p2.x + CAGE_HEIGHT * Math.sin(cageAngle + chainAngle),
        p2.y + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle));

    let p4 = createVector(
        p1.x + CAGE_HEIGHT * Math.sin(cageAngle + chainAngle),
        p1.y + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle));

    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    vertex(p4.x, p4.y);
    vertex(p1.x, p1.y);
    endShape();

    // The robot
    noStroke();
    fill(140, 38, 255);
    beginShape();
    let r1 = (p1.copy().mult((1 - robotContactPoint))).add(p4.copy().mult(robotContactPoint));

    let r2 = createVector(
        r1.x - ROBOT_WIDTH * Math.cos(robotAngle - cageAngle - chainAngle),
        r1.y - ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle));

    let r3 = createVector(
        r2.x - ROBOT_HEIGHT * Math.sin(robotAngle - cageAngle - chainAngle),
        r2.y + ROBOT_HEIGHT * Math.cos(robotAngle - cageAngle - chainAngle));

    let r4 = createVector(
        r1.x - ROBOT_HEIGHT * Math.sin(robotAngle - cageAngle - chainAngle),
        r1.y + ROBOT_HEIGHT * Math.cos(robotAngle - cageAngle - chainAngle));

    vertex(r1.x, r1.y);
    vertex(r2.x, r2.y);
    vertex(r3.x, r3.y);
    vertex(r4.x, r4.y);
    vertex(r1.x, r1.y);
    endShape();

    // Center of Mass
    let robotCenterOfMass = (r1.add(r2)).mult(0.5);
    let cageStructureCenterOfMass = (p1.add(p2).add(p3).add(p4)).mult(0.25);

    let totalCenterMass = (robotCenterOfMass.mult(0.826)).add(cageStructureCenterOfMass.mult(1 - 0.826))
    stroke(0, 100, 0);
    strokeWeight(15);
    point(totalCenterMass);


    totalCenterMassY = ((((CHAIN_LENGTH * Math.cos(chainAngle) +
        CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
        ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
            CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint) + (((CHAIN_LENGTH * Math.cos(chainAngle) +
                CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
                ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
                    CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint)
                - ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle))) * 0.5) * 0.826 + (0.25 * ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
                    CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle) +
                    (CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle) +
                    (CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle))) * (1 - 0.826)

    // const chainComponent = CHAIN_LENGTH * Math.cos(chainAngle);
    // const cageComponent = CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle);
    // const heightComponent = CAGE_HEIGHT * Math.cos(cageAngle + chainAngle);
    // const robotAdjustment = ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle);

    // const firstTerm =
    //     ((chainComponent + cageComponent) * (1 - robotContactPoint) +
    //         (chainComponent + cageComponent + heightComponent) * robotContactPoint);

    // const combinedTerm = firstTerm + (firstTerm - robotAdjustment);

    // const weightedAverage = (combinedTerm * 0.5) * 0.826;

    // const additionalTerm =
    //     0.174 * chainComponent +
    //     0.087 * heightComponent

    // const result = weightedAverage + additionalTerm;

    // console.log(totalCenterMass.y, totalCenterMassY)

    // Components
    const chainComponent = CHAIN_LENGTH * Math.cos(chainAngle);
    const cageComponent = CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle);
    const heightComponent = CAGE_HEIGHT * Math.cos(cageAngle + chainAngle);
    const robotAdjustment = ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle);

    // Partial derivatives
    const dChainComponent_dChainAngle = -CHAIN_LENGTH * Math.sin(chainAngle);
    const dCageComponent_dChainAngle = (CAGE_WIDTH / 2) * Math.cos(cageAngle + chainAngle);
    const dHeightComponent_dChainAngle = -CAGE_HEIGHT * Math.sin(cageAngle + chainAngle);
    const dRobotAdjustment_dChainAngle = -ROBOT_WIDTH * Math.cos(robotAngle - cageAngle - chainAngle);

    const dChainComponent_dCageAngle = 0;
    const dCageComponent_dCageAngle = (CAGE_WIDTH / 2) * Math.cos(cageAngle + chainAngle);
    const dHeightComponent_dCageAngle = -CAGE_HEIGHT * Math.sin(cageAngle + chainAngle);
    const dRobotAdjustment_dCageAngle = -ROBOT_WIDTH * Math.cos(robotAngle - cageAngle - chainAngle);

    // Derivative of firstTerm w.r.t. chainAngle
    const dFirstTerm_dChainAngle =
        dChainComponent_dChainAngle * (1 - robotContactPoint) +
        dCageComponent_dChainAngle * (1 - robotContactPoint) +
        (dChainComponent_dChainAngle + dCageComponent_dChainAngle + dHeightComponent_dChainAngle) * robotContactPoint;

    // Derivative of firstTerm w.r.t. cageAngle
    const dFirstTerm_dCageAngle =
        dChainComponent_dCageAngle * (1 - robotContactPoint) +
        dCageComponent_dCageAngle * (1 - robotContactPoint) +
        (dChainComponent_dCageAngle + dCageComponent_dCageAngle + dHeightComponent_dCageAngle) * robotContactPoint;

    // Derivative of combinedTerm
    const dCombinedTerm_dChainAngle = dFirstTerm_dChainAngle + (dFirstTerm_dChainAngle - dRobotAdjustment_dChainAngle);
    const dCombinedTerm_dCageAngle = dFirstTerm_dCageAngle + (dFirstTerm_dCageAngle - dRobotAdjustment_dCageAngle);

    // Derivative of result
    const dResult_dChainAngle =
        (dCombinedTerm_dChainAngle * 0.5) * 0.826 +
        0.174 * dChainComponent_dChainAngle + 0.087 * dHeightComponent_dChainAngle;

    const dResult_dCageAngle =
        (dCombinedTerm_dCageAngle * 0.5) * 0.826 +
        0.174 * dChainComponent_dCageAngle + 0.087 * dHeightComponent_dCageAngle;
    if (gravity) {
        cageSlider.value(cageSlider.value() + dResult_dCageAngle * 0.1);
        chainSlider.value(chainSlider.value() + dResult_dChainAngle * 0.1);
    }
    // Output derivatives
    // console.log("Derivative w.r.t. chainAngle:", dResult_dChainAngle);
    // console.log("Derivative w.r.t. cageAngle:", dResult_dCageAngle);

    // robotCenterOfMass.y = (((CHAIN_LENGTH * Math.cos(chainAngle) +
    //     CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
    //     ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
    //         CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint) + (((CHAIN_LENGTH * Math.cos(chainAngle) +
    //             CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
    //             ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
    //                 CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint)
    //             - ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle))) * 0.5

    // cageStructureCenterOfMass.y = 0.25 * ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
    //     CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle) +
    //     (CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle) +
    //     (CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle))

    // r1.y = (CHAIN_LENGTH * Math.cos(chainAngle) +
    //     CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
    //     ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
    //         CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint;
    // r2.y = ((CHAIN_LENGTH * Math.cos(chainAngle) +
    //     CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) * (1 - robotContactPoint) +
    //     ((CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) +
    //         CAGE_HEIGHT * Math.cos(cageAngle + chainAngle)) * robotContactPoint)
    //     - ROBOT_WIDTH * Math.sin(robotAngle - cageAngle - chainAngle);


    // p1.y = CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle);

    // p2.y = CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle);

    // p3.y = (CHAIN_LENGTH * Math.cos(chainAngle) - CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle);

    // p4.y = (CHAIN_LENGTH * Math.cos(chainAngle) + CAGE_WIDTH / 2 * Math.sin(cageAngle + chainAngle)) + CAGE_HEIGHT * Math.cos(cageAngle + chainAngle);

    // chainPoint.y = CHAIN_LENGTH * Math.cos(chainAngle);


}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
};