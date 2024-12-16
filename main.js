const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const GRAPH_X = 820;
const GRAPH_Y = 272;
const GRAPH_WIDTH = 350;
const GRAPH_HEIGHT = 250;
const NEURON_SIZE = 28;
const NEURON_SPACING_X = 120;
const NEURON_SPACING_Y = 45;
const DATASET_X = GRAPH_X - 40;
const DATASET_Y = GRAPH_HEIGHT + 80;
const LEGEND_SIZE = 10;
const LINE_HEIGHT = 15;
const FONT_SIZE = 12;
const EPOCH_BAR_HEIGHT = 20;
const BUTTONS = [
    { x: 575, y: 0, width: 82, height: 20, color: "#FF6161", text: "Train again" },
    { x: 695, y: 0, width: 82, height: 20, color: "#00AAFF", text: "Screenshot" },

    { x: 820, y: 0, width: 40, height: 20, color: "#555500", text: "LR +" },
    { x: 870, y: 0, width: 40, height: 20, color: "#FF9800", text: "LR -" },

    { x: 920, y: 0, width: 40, height: 20, color: "#555555", text: "DR +" },
    { x: 970, y: 0, width: 40, height: 20, color: "#FF5577", text: "DR -" },

    { x: 1020, y: 0, width: 70, height: 20, color: "#007700", text: "Load CSV" }
];


let canvas = document.getElementById("NeuroNet");
ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let perceptron;
let learningRate = 0.5;
let dropoutRate = 0.0;
let epochs = 1500;
let epoch = 0;
let dataIndex = 0;

const trainingData = [
    { inputs: [0.1, 0.2, 0.3, 0.4, 0.5], outputs: [0.14, 0.26, 0.35] },
    { inputs: [0.5, 0.4, 0.3, 0.2, 0.1], outputs: [0.33, 0.29, 0.07] },
    { inputs: [0.9, 0.8, 0.7, 0.6, 0.5], outputs: [0.58, 0.64, 0.35] },
    { inputs: [0.3, 0.1, 0.4, 0.7, 0.2], outputs: [0.11, 0.33, 0.14] },
    { inputs: [0.7, 0.6, 0.5, 0.4, 0.3], outputs: [0.41, 0.46, 0.21] },
];
let errors = new Array(trainingData.length).fill(0);

function restart() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    epoch = 0;
    dataIndex = 0;
    perceptron = new Perceptron(learningRate, 0.00001);

    perceptron.createLayers([
        { size: trainingData[0].inputs.length, activation: Cell.LINEAR },
        { size: 4, activation: Cell.SIGMOID },
        { size: trainingData[0].outputs.length, activation: Cell.LINEAR },
    ]);

    perceptron.setInputVector(trainingData[0].inputs);
    perceptron.setOutputVector(trainingData[0].outputs);
    perceptron.setDropoutRate(dropoutRate);
}

function setup() {
    restart();
}

function draw() {
    clearCanvas();

    if (epoch < epochs) {
        trainCurrentData();
    }

    const color = getColorByIndex(dataIndex, trainingData.length);

    drawNet(perceptron, color);
    drawTrainingDataset(trainingData, DATASET_X, DATASET_Y);
}

function isInside(pos, rect) {
    return (
        pos.x >= rect.x &&
        pos.x <= rect.x + rect.width &&
        pos.y >= rect.y &&
        pos.y <= rect.y + rect.height
    );
}

canvas.addEventListener("click", function (event) {
    const mousePos = getMousePosition(canvas, event);

    BUTTONS.forEach((button) => {
        if (isInside(mousePos, button)) {
            switch (button.text) {
                case "Train again":
                    restart(); // restart
                    break;
                case "Screenshot":
                    const image = canvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream");
                    window.location.href = image; // Save screenshot
                    break;
                case "LR +":
                    adjustLearningRate(0.05); // Learning rate increase
                    break;
                case "LR -":
                    adjustLearningRate(-0.05); // Learning rate decrease
                    break;
                case "DR +":
                    adjustDropoutRate(0.01); // Dropout rate increase
                    break;
                case "DR -":
                    adjustDropoutRate(-0.01); // Dropout rate decrease
                    break;
                case "Load CSV":
                    loadCSVData((data) => {
                        trainingData.length = 0;

                        const firstRow = data[0];
                        const inputColumns = [];
                        const outputColumns = [];

                        Object.keys(firstRow).forEach((key) => {
                            if (key.toLowerCase().startsWith("input")) {
                                inputColumns.push(key);
                            } else if (key.toLowerCase().startsWith("output")) {
                                outputColumns.push(key);
                            }
                        });

                        data.forEach((row) => {
                            const inputs = inputColumns.map((col) => parseFloat(row[col] || 0));
                            const outputs = outputColumns.map((col) => parseFloat(row[col] || 0));
                            trainingData.push({ inputs, outputs });
                        });

                        epochs = trainingData.length * 5;

                        restart();

                        console.log("New training data loaded:", trainingData);
                        console.log("Input columns:", inputColumns);
                        console.log("Output columns:", outputColumns);
                    });
                    break;
            }
        }
    });
});


function getMousePosition(canvas, event) {
    let rectangle = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rectangle.left,
        y: event.clientY - rectangle.top
    };
}

function clearCanvas() {
    ctx.fillStyle = "#fff";
    // clear NN area
    ctx.fillRect(GRAPH_X - 5, GRAPH_Y + 8, CANVAS_WIDTH, CANVAS_HEIGHT);
    // clear Training Dataset info area
    ctx.fillRect(0, 0, GRAPH_X - 5, CANVAS_HEIGHT);
}

function trainCurrentData() {
    const data = trainingData[dataIndex];

    perceptron.setInputVector(data.inputs);
    perceptron.setOutputVector(data.outputs);

    perceptron.forwardPass();
    perceptron.backPropagation();

    errors[dataIndex] = perceptron.getNetError();
    epoch++;
    dataIndex = (dataIndex + 1) % trainingData.length;
}

function getColorByIndex(index, totalIndices) {
    const hue = (index / totalIndices) * 360;
    return `hsl(${hue}, 100%, 50%)`;
}

function drawTrainingDataset(dataset, x, y) {
    ctx.font = `${FONT_SIZE}px Arial`;
    ctx.fillStyle = "#000000";
    ctx.fillText("Training dataset:", x, y);

    dataset.forEach((data, index) => {
        const inputs = data.inputs.map((v) => v.toFixed(2)).join(", ");
        const outputs = data.outputs.map((v) => v.toFixed(2)).join(", ");
        const error = errors[index] || 0;
        const text = `inputs: [${inputs}] outputs: [${outputs}] error: ${error.toFixed(3)}`;

        ctx.fillStyle = "#000000";
        ctx.fillText(text, x + LEGEND_SIZE + 5, y + (index + 1) * LINE_HEIGHT);

        const color = getColorByIndex(index, dataset.length);
        ctx.fillStyle = color;
        ctx.fillRect(x, y + (index + 1) * LINE_HEIGHT - 10, LEGEND_SIZE, LEGEND_SIZE);
    });
}

function drawNet(perceptron, datasetColor) {
    drawBackground();
    drawGraph(perceptron, datasetColor);
    drawNeuralNetwork(perceptron);
}

function drawButtons() {
    BUTTONS.forEach((button) => {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = "white";
        ctx.font = "13px Arial";
        ctx.fillText(button.text, button.x + 5, button.y + 15);
    });
}

function drawBackground() {

    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 0, CANVAS_WIDTH, EPOCH_BAR_HEIGHT);

    ctx.fillStyle = "white";
    ctx.fillText(`Epoch: ${perceptron.getEpoch()}`, 15, 15);
    ctx.fillText(`Learning rate: ${perceptron.getLearningRate().toFixed(2)}`, 90, 15);
    ctx.fillText(`Dropout rate: ${(perceptron.dropoutRate || 0).toFixed(2)}`, 210, 15);
    ctx.fillText(`Net error: ${perceptron.getNetError().toFixed(4)}`, 320, 15);
    ctx.fillText(`Err threshold: ${perceptron.getErrorTrashold()}`, 430, 15);

    drawButtons();
}

function drawGraph(perceptron, color) {
    ctx.strokeStyle = "#c5e5b2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(GRAPH_X, GRAPH_Y - GRAPH_HEIGHT);
    ctx.lineTo(GRAPH_X, GRAPH_Y);
    ctx.moveTo(GRAPH_X, GRAPH_Y);
    ctx.lineTo(GRAPH_X + GRAPH_WIDTH, GRAPH_Y);
    ctx.stroke();

    const currentEpoch = perceptron.getEpoch();
    if (currentEpoch > 0) {
        ctx.fillStyle = color;
        ctx.fillRect(
            GRAPH_X + (currentEpoch / epochs) * GRAPH_WIDTH,
            GRAPH_Y - Math.abs(perceptron.getNetError()) * 650,
            1,
            1
        );
    }

    ctx.fillStyle = "#ddd";
    ctx.fillText("0", GRAPH_X - 5, GRAPH_Y + 20);
    ctx.fillText("epochs", GRAPH_X + GRAPH_WIDTH / 2, GRAPH_Y + 30);
    ctx.fillText(epochs, GRAPH_X + GRAPH_WIDTH, GRAPH_Y + 20);
    ctx.fillText("Error", GRAPH_X - 40, GRAPH_Y - 220);
}

function drawNeuralNetwork(perceptron) {
    const neuronPositions = {};

    perceptron.layers.forEach((layer, layerIndex) => {
        const neurons = perceptron.getNeuronsByLayer(layer);
        const x = 20 + NEURON_SPACING_X * layerIndex;

        // get layer activation type and draw it
        const activation = neurons[0]?.cell.activation || Cell.LINEAR;
        drawActivationFunction(layerIndex, activation, x, 70);

        neurons.forEach((neuron, neuronIndex) => {
            const y = 70 + NEURON_SPACING_Y * neuronIndex;

            neuronPositions[neuron.id] = [x, y];
            drawNeuron(neuron, x, y, neuronPositions);
        });
    });
}

function drawNeuron(neuron, x, y, neuronPositions) {
    drawNeuronLinks(neuron, x, y, neuronPositions);

    const radius = NEURON_SIZE / 2;

    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI); // center of the circle and radius
    ctx.fillStyle = getNeuronColor(neuron);
    ctx.fill();

    // neuron label
    ctx.fillStyle = "#6c6c6c";
    ctx.fillText(neuron.id, x + radius / 2 - 3, y + radius + 5);

    drawNeuronData(neuron, x, y);
}


function drawNeuronData(neuron, x, y) {
    const textOffsetX = 40;

    ctx.fillStyle = "#333";

    if (neuron.cell.layer === 0 && !neuron.cell.isBias) {
        ctx.fillText(`in: ${neuron.cell.input.toFixed(2)}`, x - textOffsetX + 20, y + NEURON_SIZE / 2 - 20);
    }

    if (neuron.cell.getTargetOutput !== null && neuron.cell.layer === perceptron.layers.length - 1) {
        ctx.fillText(`out: ${neuron.cell.getOutput().toFixed(3)}`, x + textOffsetX, y + NEURON_SIZE / 3);
        ctx.fillStyle = "grey";
        ctx.fillText(`target: ${neuron.cell.getTargetOutput().toFixed(3)}`, x + textOffsetX, y + (NEURON_SIZE * 2) / 3);
    }
}

function drawNeuronLinks(neuron, x, y, neuronPositions) {
    neuron.links.forEach((link) => {
        if (link.type === "left") {
            ctx.beginPath();
            ctx.moveTo(x, y + NEURON_SIZE / 2);

            if (neuronPositions[link.id]) {
                ctx.lineTo(
                    neuronPositions[link.id][0] + NEURON_SIZE,
                    neuronPositions[link.id][1] + NEURON_SIZE / 2
                );
            }

            ctx.lineWidth = Math.min(link.weight * 2, 5);
            ctx.strokeStyle = link.weight < 0 ? "#496cab" : "#f89f9f";
            ctx.stroke();
        }
    });
}

function getNeuronColor(neuron) {
    if (neuron.cell.isRecurrent) return "#F0C7F7";
    if (neuron.cell.isBias) return "#c7ecf7";
    if (neuron.cell.layer === 0) return "#f4d6bb";
    if (neuron.cell.layer === perceptron.layers.length - 1) return "#b5e8b8";
    return "#e3e2e5";
}

function drawActivationFunction(layerIndex, activation, x, y) {
    ctx.fillStyle = "#ccc";
    ctx.font = "12px Arial";
    ctx.fillText(activation, x, y - 20);
}


function adjustLearningRate(delta) {
    learningRate = perceptron.getLearningRate() + delta;
    learningRate = Math.max(0.00001, Math.min(learningRate, 1)); // limit LR in range [0.00001, 1]
    perceptron.setLearningRate(learningRate);
}

function adjustDropoutRate(delta) {
    const currentRate = perceptron.dropoutRate || 0;
    let newRate = currentRate + delta;
    dropoutRate = Math.max(0.0, Math.min(newRate, 1.0));
    perceptron.setDropoutRate(dropoutRate);
}

function loadCSVData(callback) {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".csv";

    inputElement.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvContent = e.target.result;
                const parsedData = parseCSV(csvContent);
                callback(parsedData);
            };
            reader.readAsText(file);
        }
    });

    inputElement.click();
}


function parseCSV(csvString, delimiter = ",") {
    const rows = csvString.trim().split("\n");
    const headers = rows[0].split(delimiter);

    return rows.slice(1).map((row) => {
        const values = row.split(delimiter);
        return headers.reduce((acc, header, index) => {
            acc[header.trim()] = parseFloat(values[index].trim());
            return acc;
        }, {});
    });
}

