let cnvs = document.getElementById("NeuroNet");
ctx = cnvs.getContext('2d');

cnvs.width  = 800;
cnvs.height = 700;

// --(i1)--(n1)
//       \/    \__(o1)
//       /\    /
// --(i1)--(n1)
//       \/    \__(o2)
//       /\    /
// --(i3)--(n3)

let perceptron = new Perceptron(0.98, 0.001);

// Creating neurones
perceptron.addNeuron(new Cell(true), 'i1', 1);
perceptron.addNeuron(new Cell(true), 'i2', 1);
perceptron.addNeuron(new Cell(true), 'i3', 1);
perceptron.addNeuron(new Cell(), 'n1', 2, 0.04);
perceptron.addNeuron(new Cell(), 'n2', 2, 0.03);
perceptron.addNeuron(new Cell(), 'n3', 2, 0.13);
perceptron.addNeuron(new Cell(), 'o1', 3);
perceptron.addNeuron(new Cell(), 'o2', 3);

// Linking neurones
perceptron.link('i1', 'n1');
perceptron.link('i1', 'n2');
perceptron.link('i1', 'n3');
perceptron.link('i2', 'n1');
perceptron.link('i2', 'n2');
perceptron.link('i2', 'n3');
perceptron.link('i3', 'n1');
perceptron.link('i3', 'n2');
perceptron.link('i3', 'n3');
perceptron.link('n1', 'o1');
perceptron.link('n2', 'o1');
perceptron.link('n3', 'o1');
perceptron.link('n1', 'o2');
perceptron.link('n2', 'o2');
perceptron.link('n3', 'o2');

// Set inputs and target outputs
let inputNeuron1  = perceptron.getNeuron('i1');
let inputNeuron2  = perceptron.getNeuron('i2');
let inputNeuron3  = perceptron.getNeuron('i3');
let outputNeuron1 = perceptron.getNeuron('o1');
let outputNeuron2 = perceptron.getNeuron('o2');

inputNeuron1.cell.setInput(0.51);
inputNeuron2.cell.setInput(0.12);
inputNeuron3.cell.setInput(0.45);
outputNeuron1.cell.setTargetOutput(0.9);
outputNeuron2.cell.setTargetOutput(0.1);

perceptron.updateNeuron('i1', inputNeuron1);
perceptron.updateNeuron('i2', inputNeuron2);
perceptron.updateNeuron('i3', inputNeuron3);
perceptron.updateNeuron('o1', outputNeuron1);
perceptron.updateNeuron('o2', outputNeuron2);

function calcNet(perceptron) {
    // Forward pass
    perceptron.forwardPass();

    drawNet(perceptron);
    // Learning
    perceptron.backPropagation();

    setInterval(function () { calcNet(perceptron);}, 100);
}

calcNet(perceptron);

function drawNet(perceptron) {

    ctx.font = "14px Arial";
    ctx.fillStyle   = "#ffffff";
    ctx.fillRect(0, 0, cnvs.width, cnvs.height);

    ctx.fillStyle   = "#4caf50";
    ctx.fillRect(0, 0, cnvs.width, 20);

    ctx.fillStyle = "white";
    ctx.fillText('Epoch: ' + perceptron.getEpoch(), 20, 15);
    ctx.fillText('Learning rate: ' + perceptron.getLearningRate(), 120, 15);
    ctx.fillText('Net error: ' + perceptron.getNetError().toFixed(7), 260, 15);
    ctx.fillText('Err threshold: ' + perceptron.getErrorTrashold(), 420, 15);

    let neuronPositions = {};

    for (let i = 0; i < perceptron.layers.length; i++) {

        let neurons = perceptron.getNeuronsByLayer(perceptron.layers[i]);

        for (let j = 0; j < neurons.length; j++) {

            let posX = 20 + 120 * i;
            let posY = 50 + 120 * j;
            let neuron = neurons[j];

            neuronPositions[neuron.id] = [posX, posY];

            let neuronSize = 30;

            let rightLinksCount = 0;
            let leftLinksCount = 0;
            if (neuron.links.length > 0) {
                for (let k = 0; k < neuron.links.length; k++) {
                    if (neuron.links[k].type === 'left') {
                        leftLinksCount++;
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

            ctx.fillStyle = "#ddd";
            ctx.fillRect(posX, posY, neuronSize, neuronSize);

            ctx.fillStyle = "#555";
            ctx.fillText(neuron.id, neuronSize / 5 + posX, neuronSize / 1.6  + posY);

            if (rightLinksCount === 0) {
                ctx.fillStyle = "#333";
                ctx.fillText('out: ' + neuron.cell.getOutput().toFixed(3), neuronSize * 1.3 + posX, neuronSize / 2.3 + posY);
                ctx.fillStyle = "grey";
                ctx.fillText('target: ' + neuron.cell.getTargetOutput().toFixed(3), neuronSize * 1.3 + posX, neuronSize / 1 + posY);
            }

            if (leftLinksCount === 0) {
                ctx.fillStyle = "#333";
                ctx.fillText('in: ' + neuron.cell.input.toFixed(2), neuronSize * -0.4 + posX, posY - neuronSize / 5);
            }

            if (neuron.bias !== 0) {
                ctx.fillStyle = "#c3c";
                ctx.font = "11px Arial";
                ctx.fillText('b: ' + neuron.bias.toFixed(2), neuronSize * -0.1 + posX, posY - neuronSize / 5);
                ctx.font = "14px Arial";
            }
        }

    }

}