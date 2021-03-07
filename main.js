let canvas = document.getElementById("NeuroNet");
ctx = canvas.getContext('2d');

canvas.width  = 800;
canvas.height = 700;

// --(i1)--(n1)
//       \/    \__(o1)
//       /\    /
// --(i1)--(n1)
//       \/    \__(o2)
//       /\    /
// --(i3)--(n3)

let perceptron;

function initPerceptron() {

    perceptron = new Perceptron(0.98, 0.001);

// Creating neurones
    perceptron.addNeuron(new Cell(true), 'i1', 1);
    perceptron.addNeuron(new Cell(true), 'i2', 1);
    perceptron.addNeuron(new Cell(true), 'i3', 1);
    perceptron.addNeuron(new Cell(true), 'i4', 1);
    perceptron.addNeuron(new Cell(true), 'i5', 1);
    perceptron.addNeuron(new Cell(), 'n1', 2, 0.04);
    perceptron.addNeuron(new Cell(), 'n2', 2, 0.03);
    perceptron.addNeuron(new Cell(), 'n3', 2);
    perceptron.addNeuron(new Cell(), 'n4', 2, 0.53);
    perceptron.addNeuron(new Cell(), 'n5', 2);
    perceptron.addNeuron(new Cell(), 'o1', 3);
    perceptron.addNeuron(new Cell(), 'o2', 3);
    perceptron.addNeuron(new Cell(), 'o3', 3);

// Linking neurones
    perceptron.link('i1', 'n1');
    perceptron.link('i1', 'n2');
    perceptron.link('i1', 'n3');
    perceptron.link('i1', 'n4');
    perceptron.link('i1', 'n5');

    perceptron.link('i2', 'n1');
    perceptron.link('i2', 'n2');
    perceptron.link('i2', 'n3');
    perceptron.link('i2', 'n4');
    perceptron.link('i2', 'n5');

    perceptron.link('i3', 'n1');
    perceptron.link('i3', 'n2');
    perceptron.link('i3', 'n3');
    perceptron.link('i3', 'n4');
    perceptron.link('i3', 'n5');

    perceptron.link('i4', 'n1');
    perceptron.link('i4', 'n2');
    perceptron.link('i4', 'n3');
    perceptron.link('i4', 'n4');
    perceptron.link('i4', 'n5');

    perceptron.link('i5', 'n1');
    perceptron.link('i5', 'n2');
    perceptron.link('i5', 'n3');
    perceptron.link('i5', 'n4');
    perceptron.link('i5', 'n5');

    perceptron.link('n1', 'o1');
    perceptron.link('n1', 'o2');
    perceptron.link('n1', 'o3');

    perceptron.link('n2', 'o1');
    perceptron.link('n2', 'o2');
    perceptron.link('n2', 'o3');

    perceptron.link('n3', 'o1');
    perceptron.link('n3', 'o2');
    perceptron.link('n3', 'o3');

    perceptron.link('n4', 'o1');
    perceptron.link('n4', 'o2');
    perceptron.link('n4', 'o3');

    perceptron.link('n5', 'o1');
    perceptron.link('n5', 'o2');
    perceptron.link('n5', 'o3');

// Set inputs and target outputs
    let inputNeuron1  = perceptron.getNeuron('i1');
    let inputNeuron2  = perceptron.getNeuron('i2');
    let inputNeuron4  = perceptron.getNeuron('i3');
    let inputNeuron5  = perceptron.getNeuron('i4');
    let inputNeuron3  = perceptron.getNeuron('i5');
    let outputNeuron1 = perceptron.getNeuron('o1');
    let outputNeuron2 = perceptron.getNeuron('o2');
    let outputNeuron3 = perceptron.getNeuron('o3');

    inputNeuron1.cell.setInput(0.61);
    inputNeuron2.cell.setInput(0.12);
    inputNeuron3.cell.setInput(0.45);
    inputNeuron4.cell.setInput(0.23);
    inputNeuron5.cell.setInput(0.29);
    outputNeuron1.cell.setTargetOutput(0.9);
    outputNeuron2.cell.setTargetOutput(0.1);
    outputNeuron3.cell.setTargetOutput(0.2);

    perceptron.updateNeuron('i1', inputNeuron1);
    perceptron.updateNeuron('i2', inputNeuron2);
    perceptron.updateNeuron('i3', inputNeuron3);
    perceptron.updateNeuron('i4', inputNeuron4);
    perceptron.updateNeuron('i5', inputNeuron5);
    perceptron.updateNeuron('o1', outputNeuron1);
    perceptron.updateNeuron('o2', outputNeuron2);
    perceptron.updateNeuron('o3', outputNeuron3);
}

function calcNet() {
    // Forward pass
    perceptron.forwardPass();

    drawNet(perceptron);
    // Learning
    perceptron.backPropagation();

    setInterval(function () { calcNet();}, 100);
}

initPerceptron();
calcNet();


function getMousePosition(canvas, event) {
    let rectangle = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rectangle.left,
        y: event.clientY - rectangle.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//Binding the click event on the canvas
canvas.addEventListener('click', function(evnt) {
    let mousePos = getMousePosition(canvas, evnt);

    if (isInside(mousePos, {x:695, y:0, width:82, height:20})) {
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = image;
    } else  if (isInside(mousePos, {x:575, y:0, width:82, height:20})) {
        location.reload();
    }
}, false);

function drawNet(perceptron) {

    ctx.font = "14px Arial";
    ctx.fillStyle   = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle   = "#4caf50";
    ctx.fillRect(0, 0, canvas.width, 20);

    ctx.fillStyle = "white";
    ctx.fillText('Epoch: ' + perceptron.getEpoch(), 20, 15);
    ctx.fillText('Learning rate: ' + perceptron.getLearningRate(), 120, 15);
    ctx.fillText('Net error: ' + perceptron.getNetError().toFixed(7), 260, 15);
    ctx.fillText('Err threshold: ' + perceptron.getErrorTrashold(), 420, 15);
    ctx.fillStyle   = "#FF6161";
    ctx.fillRect(575, 0, 82, 20);
    ctx.fillStyle = "white";
    ctx.fillText('Recalculate', 580, 15);

    ctx.fillStyle   = "#00AAFF";
    ctx.fillRect(695, 0, 82, 20);
    ctx.fillStyle = "white";
    ctx.fillText('Screenshot', 700, 15);

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