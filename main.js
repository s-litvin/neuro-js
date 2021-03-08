let canvas = document.getElementById("NeuroNet");
ctx = canvas.getContext('2d');

canvas.width  = 800;
canvas.height = 700;

// --(x1)--(h11)
//       \/    \__(y1)
//       /\    /
// --(x1)--(h11)
//       \/    \__(y2)
//       /\    /
// --(x3)--(h13)

let perceptron;

function initPerceptron() {

    perceptron = new Perceptron(0.98, 0.001);

// Creating neurones
    perceptron.addNeuron(new Cell(true), 'x1', 1);
    perceptron.addNeuron(new Cell(true), 'x2', 1);
    perceptron.addNeuron(new Cell(true), 'x3', 1);
    perceptron.addNeuron(new Cell(true), 'x4', 1);
    perceptron.addNeuron(new Cell(true), 'x5', 1);

    perceptron.addNeuron(new Cell(), 'h11', 2, 0.04);
    perceptron.addNeuron(new Cell(), 'h12', 2, 0.03);
    perceptron.addNeuron(new Cell(), 'h13', 2);
    perceptron.addNeuron(new Cell(), 'h14', 2, 0.53);
    perceptron.addNeuron(new Cell(), 'h15', 2);

    perceptron.addNeuron(new Cell(), 'h21', 3, 0.14);
    perceptron.addNeuron(new Cell(), 'h22', 3);
    perceptron.addNeuron(new Cell(), 'h23', 3);
    perceptron.addNeuron(new Cell(), 'h24', 3, 0.11);
    perceptron.addNeuron(new Cell(), 'h25', 3, 0.27);

    perceptron.addNeuron(new Cell(), 'y1', 4);
    perceptron.addNeuron(new Cell(), 'y2', 4);
    perceptron.addNeuron(new Cell(), 'y3', 4);

// Linking neurones
    perceptron.link('x1', 'h11');
    perceptron.link('x1', 'h12');
    perceptron.link('x1', 'h13');
    perceptron.link('x1', 'h14');
    perceptron.link('x1', 'h15');

    perceptron.link('x2', 'h11');
    perceptron.link('x2', 'h12');
    perceptron.link('x2', 'h13');
    perceptron.link('x2', 'h14');
    perceptron.link('x2', 'h15');

    perceptron.link('x3', 'h11');
    perceptron.link('x3', 'h12');
    perceptron.link('x3', 'h13');
    perceptron.link('x3', 'h14');
    perceptron.link('x3', 'h15');

    perceptron.link('x4', 'h11');
    perceptron.link('x4', 'h12');
    perceptron.link('x4', 'h13');
    perceptron.link('x4', 'h14');
    perceptron.link('x4', 'h15');

    perceptron.link('x5', 'h11');
    perceptron.link('x5', 'h12');
    perceptron.link('x5', 'h13');
    perceptron.link('x5', 'h14');
    perceptron.link('x5', 'h15');
    //

    perceptron.link('h11', 'h21');
    perceptron.link('h11', 'h22');
    perceptron.link('h11', 'h23');
    perceptron.link('h11', 'h24');
    perceptron.link('h11', 'h25');

    perceptron.link('h12', 'h21');
    perceptron.link('h12', 'h22');
    perceptron.link('h12', 'h23');
    perceptron.link('h12', 'h24');
    perceptron.link('h12', 'h25');

    perceptron.link('h13', 'h21');
    perceptron.link('h13', 'h22');
    perceptron.link('h13', 'h23');
    perceptron.link('h13', 'h24');
    perceptron.link('h13', 'h25');

    perceptron.link('h14', 'h21');
    perceptron.link('h14', 'h22');
    perceptron.link('h14', 'h23');
    perceptron.link('h14', 'h24');
    perceptron.link('h14', 'h25');

    perceptron.link('h15', 'h21');
    perceptron.link('h15', 'h22');
    perceptron.link('h15', 'h23');
    perceptron.link('h15', 'h24');
    perceptron.link('h15', 'h25');
    
    //

    perceptron.link('h21', 'y1');
    perceptron.link('h21', 'y2');
    perceptron.link('h21', 'y3');

    perceptron.link('h22', 'y1');
    perceptron.link('h22', 'y2');
    perceptron.link('h22', 'y3');

    perceptron.link('h23', 'y1');
    perceptron.link('h23', 'y2');
    perceptron.link('h23', 'y3');

    perceptron.link('h24', 'y1');
    perceptron.link('h24', 'y2');
    perceptron.link('h24', 'y3');

    perceptron.link('h25', 'y1');
    perceptron.link('h25', 'y2');
    perceptron.link('h25', 'y3');

// Set inputs and target outputs
    let inputNeuroh11  = perceptron.getNeuron('x1');
    let inputNeuroh12  = perceptron.getNeuron('x2');
    let inputNeuroh14  = perceptron.getNeuron('x3');
    let inputNeuroh15  = perceptron.getNeuron('x4');
    let inputNeuroh13  = perceptron.getNeuron('x5');
    let outputNeuroh11 = perceptron.getNeuron('y1');
    let outputNeuroh12 = perceptron.getNeuron('y2');
    let outputNeuroh13 = perceptron.getNeuron('y3');

    inputNeuroh11.cell.setInput(0.61);
    inputNeuroh12.cell.setInput(0.12);
    inputNeuroh13.cell.setInput(0.45);
    inputNeuroh14.cell.setInput(0.23);
    inputNeuroh15.cell.setInput(0.29);
    outputNeuroh11.cell.setTargetOutput(0.9);
    outputNeuroh12.cell.setTargetOutput(0.1);
    outputNeuroh13.cell.setTargetOutput(0.2);

    perceptron.updateNeuron('x1', inputNeuroh11);
    perceptron.updateNeuron('x2', inputNeuroh12);
    perceptron.updateNeuron('x3', inputNeuroh13);
    perceptron.updateNeuron('x4', inputNeuroh14);
    perceptron.updateNeuron('x5', inputNeuroh15);
    perceptron.updateNeuron('y1', outputNeuroh11);
    perceptron.updateNeuron('y2', outputNeuroh12);
    perceptron.updateNeuron('y3', outputNeuroh13);
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

ctx.fillStyle   = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawNet(perceptron) {

    ctx.font = "14px Arial";
    ctx.fillStyle   = "#ffffff";
    ctx.fillRect(0, 0, 575, canvas.height);

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
    ctx.fillText('Train again', 580, 15);

    ctx.fillStyle   = "#00AAFF";
    ctx.fillRect(695, 0, 82, 20);
    ctx.fillStyle = "white";
    ctx.fillText('Screenshot', 700, 15);

    // graph
    let gX = 650;
    let gY = 350;
    ctx.beginPath();
    ctx.moveTo(gX, gY - 252);
    ctx.lineTo(gX, gY + 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c5e5b2';
    ctx.moveTo(gX, gY + 2);
    ctx.lineTo(gX + 150, gY + 2);
    ctx.stroke();
    let epoch = perceptron.getEpoch();
    if (epoch > 0) {
        ctx.fillStyle   = "#ff0000";
        ctx.fillRect(gX + epoch, gY - Math.abs(perceptron.getNetError()) * 150, 2, 2);
    }
    ctx.fillStyle = "#ddd";
    ctx.fillText('0', gX - 5, gY + 20);
    ctx.fillText('Error', gX + 50, gY - 220);


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
                        if (neuron.links[k].weight < 0) {
                            ctx.strokeStyle = '#496cab';
                        } else {
                            ctx.strokeStyle = '#f89f9f';
                        }
                        ctx.stroke();
                    } else {
                        rightLinksCount++;
                    }
                }
            }

            ctx.fillStyle = "#e3e2e5";
            ctx.fillRect(posX, posY, neuronSize, neuronSize);

            ctx.fillStyle = "#6c6c6c";
            ctx.fillText(neuron.id, neuronSize / 8 + posX, neuronSize / 1.6  + posY);

            if (rightLinksCount === 0 && neuron.cell.getTargetOutput() !== null) {
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