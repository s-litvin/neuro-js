let canvas = document.getElementById("NeuroNet");
ctx = canvas.getContext('2d');

canvas.width  = 1200;
canvas.height = 800;

// --(x1)--(h11)
//       \/    \__(y1)
//       /\    /
// --(x2)--(h12)
//       \/    \__(y2)
//       /\    /
// --(x3)--(h13)
//       \/    \__(y3)
//       /\    /  /
// --(x4)--(h14) /
//       \/     /
//       /\    /
// --(x5)--(h15)

let perceptron;

function setup() {

    perceptron = new Perceptron(0.98, 0.001);

    // Creating neurones
    perceptron.createLayers(
        [
            {'size' : 5},
            {'size' : 5},
            {'size' : 5},
            {'size' : 3},
        ]
    );

    // Set inputs and target outputs
    perceptron.setInputVector([0.61, 0.12, 0.45, 0.23, 0.29]);
    perceptron.setOutputVector([0.91, 0.1, 0.2]);
}

function draw() {
    // Forward pass
    perceptron.forwardPass();

    drawNet(perceptron);
    // Learning
    perceptron.backPropagation();
}

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
    } else if (isInside(mousePos, {x:575, y:0, width:82, height:20})) {
        location.reload();
    }
}, false);

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawNet(perceptron) {

    ctx.font = "13px Arial";
    ctx.fillStyle   = "#ffffff";
    ctx.fillRect(0, 0, 800, canvas.height);

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
    let gX = 850;
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
            let posY = 50 + 60 * j;
            let neuron = neurons[j];

            neuronPositions[neuron.id] = [posX, posY];

            let neuronSize = 28;

            let rightLinksCount = 0;
            let leftLinksCount = 0;
            if (neuron.links.length > 0) {
                for (let k = 0; k < neuron.links.length; k++) {
                    if (neuron.links[k].type === 'left') {
                        leftLinksCount++;
                        ctx.beginPath();
                        ctx.moveTo(posX, posY + neuronSize / 2);
                        if (typeof neuronPositions[neuron.links[k].id] !== 'undefined') {
                            ctx.lineTo(neuronPositions[neuron.links[k].id][0] + neuronSize, neuronPositions[neuron.links[k].id][1] + neuronSize / 2);
                        }
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

            if (neuron.cell.isRecurrent === true) {
                ctx.fillStyle = "#F0C7F7";
            } else if (neuron.cell.isBias === true) {
                ctx.fillStyle = "#c7ecf7";
            } else if (neuron.cell.layer === 0) {
                ctx.fillStyle = "#f4d6bb";
            } else if (neuron.cell.layer === perceptron.layers.length - 1) {
                ctx.fillStyle = "#b5e8b8";
            } else {
                ctx.fillStyle = "#e3e2e5";
            }
            ctx.fillRect(posX, posY, neuronSize, neuronSize);

            ctx.fillStyle = "#6c6c6c";
            ctx.fillText(neuron.id, neuronSize / 8 + posX, neuronSize / 1.6  + posY);

            if (rightLinksCount === 0 && neuron.cell.getTargetOutput() !== null) {
                ctx.fillStyle = "#333";
                ctx.fillText('out: ' + neuron.cell.getOutput().toFixed(3), neuronSize * 1.3 + posX, neuronSize / 2.3 + posY);
                ctx.fillStyle = "grey";
                ctx.fillText('target: ' + neuron.cell.getTargetOutput().toFixed(3), neuronSize * 1.3 + posX, neuronSize / 1 + posY);
            }

            if (leftLinksCount === 0 && neuron.cell.isBias === false) {
                ctx.fillStyle = "#333";
                ctx.fillText('in: ' + neuron.cell.input.toFixed(2), neuronSize * -0.4 + posX, posY - neuronSize / 5);
            }
        }
    }

}
