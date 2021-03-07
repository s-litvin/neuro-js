let cnvs = document.getElementById("NeuroNet");
ctx = cnvs.getContext('2d');

cnvs.width  = 1000;
cnvs.height = 900;


// --(i1)--(n1)
//       \/    \__(o1)
//       /\    /
// --(i2)--(n2)

let perceptron = new Perceptron(1);

// Creating neurones
perceptron.addNeuron(new Cell(), 'i1', 1);
perceptron.addNeuron(new Cell(), 'i2', 1);
perceptron.addNeuron(new Cell(), 'n1', 2, 0.04);
perceptron.addNeuron(new Cell(), 'n2', 2, 0.03);
perceptron.addNeuron(new Cell(), 'o1', 3);
perceptron.addNeuron(new Cell(), 'o2', 3);

// Linking neurones
perceptron.link('i1', 'n1', 0.3);
perceptron.link('i1', 'n2', 0.32);
perceptron.link('i2', 'n1', 0.41);
perceptron.link('i2', 'n2', 0.2);
perceptron.link('n1', 'o1', 0.7);
perceptron.link('n2', 'o1', 0.2);
perceptron.link('n1', 'o2', 0.2);
perceptron.link('n2', 'o2', 0.4);

// Set inputs and target outputs
let inputNeuron1  = perceptron.getNeuron('i1');
let inputNeuron2  = perceptron.getNeuron('i2');
let outputNeuron1 = perceptron.getNeuron('o1');
let outputNeuron2 = perceptron.getNeuron('o2');

inputNeuron1.cell.setInput(0.5);
inputNeuron2.cell.setInput(0.33);
outputNeuron1.cell.setTargetOutput(0.9);
outputNeuron2.cell.setTargetOutput(0.1);

perceptron.updateNeuron('i1', inputNeuron1);
perceptron.updateNeuron('i2', inputNeuron2);
perceptron.updateNeuron('o1', outputNeuron1);
perceptron.updateNeuron('o2', outputNeuron2);

let i = 0;
for (i; i < 10000; i++) {
    // Forward pass
    perceptron.forwardPass();

    drawNet(perceptron);

    // Learning
    perceptron.backPropagation();

    if (Math.pow(perceptron.getNetError(), 2) < 0.00001) {
        break;
    }

}

console.log('#: ' + i, 'O1: ' + perceptron.getNeuron('o1').cell.getOutput(), 'O2: ' + perceptron.getNeuron('o2').cell.getOutput());

function drawNet(perceptron) {

    ctx.font = "14px Arial";
    ctx.fillStyle   = "#ffffff";
    ctx.fillRect(0, 0, 1000, 900);

    let neuronPositions = {};

    for (let i = 0; i < perceptron.layers.length; i++) {

        let neurons = perceptron.getNeuronsByLayer(perceptron.layers[i]);

        for (let j = 0; j < neurons.length; j++) {

            let posX = 100 * i;
            let posY = 100 * j;
            let neuron = neurons[j];

            neuronPositions[neuron.id] = [posX, posY];

            let neuronSize = 30;

            let rightLinksCount = 0;
            if (neuron.links.length > 0) {
                for (let k = 0; k < neuron.links.length; k++) {
                    if (neuron.links[k].type === 'left') {
                        ctx.beginPath();
                        ctx.moveTo(posX, posY + neuronSize / 2);
                        ctx.lineTo(neuronPositions[neuron.links[k].id][0] + neuronSize, neuronPositions[neuron.links[k].id][1] + neuronSize / 2);
                        ctx.lineWidth = neuron.links[k].weight * 2;
                        ctx.strokeStyle = '#5555ff';
                        ctx.stroke();
                    } else {
                        rightLinksCount++;
                    }
                }
            }

            ctx.fillStyle = "#888888";
            ctx.fillRect(posX, posY, neuronSize, neuronSize);

            ctx.fillStyle = "#ffffff";
            ctx.fillText(neuron.id, neuronSize / 5 + 100 * i, neuronSize / 1.5 + 100 * j);

            if (rightLinksCount === 0) {
                ctx.fillStyle = "grey";
                ctx.fillText(neuron.cell.getOutput().toFixed(2), neuronSize * 1.3 + 100 * i, neuronSize / 2.3 + 100 * j);
            }
        }

    }

}