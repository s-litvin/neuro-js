function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function logResult(testName, passed) {
    const resultContainer = document.getElementById("test-results");
    const result = document.createElement("div");
    result.textContent = `${testName}: ${passed ? "PASSED" : "FAILED"}`;
    result.style.color = passed ? "green" : "red";
    resultContainer.appendChild(result);
}

function runTests() {
    try {
        logResult("Basic test 1: Forward Pass", testForwardPass());
        logResult("Basic test 2: Backpropagation", testBackPropagation());
        logResult("Basic test 3: Weights", testGetWeights());
        logResult("Test 4: ForwardPass. Sigmoid", testForwardPassSigmoid());
        logResult("Test 5: ForwardPass. RELU", testForwardPassRELU());
        logResult("Test 6: ForwardPass. LEAKYRELU", testForwardPassLeakyRELU());
        logResult("Test 7: ForwardPass. TANH", testForwardPassTanh());
    } catch (error) {
        console.error(error);
        const resultContainer = document.getElementById("test-results");
        resultContainer.textContent = `Error running tests: ${error.message}`;
    }
}

function testForwardPass() {
    const perceptron = new Perceptron(0.1, 0.001);
    perceptron.createLayers([{ size: 2 }, { size: 1 }]);

    perceptron.setInputVector([0.5, 0.2]);
    perceptron.forwardPass();

    const output = perceptron.getOutputVector();
    assert(output.length === 1, "Output vector should have 1 element");
    assert(output[0] >= 0 && output[0] <= 1, "Output value should be between 0 and 1");

    return true;
}

function testBackPropagation() {
    const perceptron = new Perceptron(0.1, 0.001);
    perceptron.createLayers([{ size: 2 }, { size: 1 }]);

    perceptron.setInputVector([0.5, 0.2]);
    perceptron.setOutputVector([0.8]);

    perceptron.forwardPass();
    perceptron.backPropagation();

    const weights = perceptron.getWeights();

    assert(weights.length === 1, "Weights should have entries for 1 connection layer (excluding input layer)");
    assert(weights[0].length === 2, "First layer should have 2 neurons (input layer)");
    assert(weights[0][0].weights.length === 1, "Neuron x01 should have 1 outgoing connection (to output layer)");
    assert(weights[0][1].weights.length === 1, "Neuron x02 should have 1 outgoing connection (to output layer)");

    const initialWeight = 0.5;
    const newWeight = weights[0][0].weights[0].weight;
    assert(newWeight !== initialWeight, "Weights should be updated during backpropagation");

    return true;
}


function testGetWeights() {
    const perceptron = new Perceptron(0.1, 0.001);
    perceptron.createLayers([{ size: 2 }, { size: 2 }, { size: 1 }], false);

    perceptron.link('x00', 'h10', 0.5);
    perceptron.link('x00', 'h11', -0.3);
    perceptron.link('x01', 'h10', 0.8);
    perceptron.link('x01', 'h11', 0.2);

    const weights = perceptron.getWeights();

    assert(weights.length === 2, "Weights should be retrieved for 2 layers");
    assert(weights[0][0].weights[0].weight === 0.5, "Weight for x01->h11 should be 0.5");
    assert(weights[0][1].weights[1].weight === 0.2, "Weight for x02->h12 should be 0.2");

    return true;
}

function testForwardPassSigmoid() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 2 },
        { size: 1, activation: Cell.SIGMOID }
    ], false);

    perceptron.link('x00', 'y10', 0.5);
    perceptron.link('x01', 'y10', -0.4);

    perceptron.setInputVector([1.0, 0.5]);

    perceptron.forwardPass();

    const output = perceptron.getOutputVector();

    const expected = sigmoid(1.0 * 0.5 + 0.5 * -0.4);

    assert(
        Math.abs(output[0] - expected) < 0.0001,
        `Expected ${expected}, but got ${output[0]}`
    );

    return true;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function testForwardPassRELU() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 2 },
        { size: 1, activation: Cell.RELU }
    ], false);

    perceptron.link('x00', 'y10', 1.0);
    perceptron.link('x01', 'y10', -2.0);

    perceptron.setInputVector([0.5, 1.5]);

    perceptron.forwardPass();

    const output = perceptron.getOutputVector();

    const expected = relu(0.5 * 1.0 + 1.5 * -2.0);
    assert(
        Math.abs(output[0] - expected) < 0.0001,
        `Expected ${expected}, but got ${output[0]}`
    );


    return true;
}

function relu(x) {
    return Math.max(0, x);
}

function testForwardPassLeakyRELU() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 2 },
        { size: 1, activation: Cell.LEAKYRELU }
    ], false);

    perceptron.link('x00', 'y10', 1.0);
    perceptron.link('x01', 'y10', -2.0);

    perceptron.setInputVector([0.5, 1.5]);

    perceptron.forwardPass();

    const output = perceptron.getOutputVector();

    const expected = leakyRelu(0.5 * 1.0 + 1.5 * -2.0, 0.1);
    assert(
        Math.abs(output[0] - expected) < 0.0001,
        `testForwardPassLeakyRELU: Expected ${expected}, but got ${output[0]}`
    );

    return true;
}

function leakyRelu(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

function testForwardPassTanh() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 2 },
        { size: 1, activation: Cell.TANH }
    ], false);

    perceptron.link('x00', 'y10', 0.5);
    perceptron.link('x01', 'y10', -0.4);

    perceptron.setInputVector([1.0, 0.5]);

    perceptron.forwardPass();

    const output = perceptron.getOutputVector();

    const expected = tanh(1.0 * 0.5 + 0.5 * -0.4);
    assert(
        Math.abs(output[0] - expected) < 0.0001,
        `Expected ${expected}, but got ${output[0]}`
    );

    return true;
}

function tanh(x) {
    return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
}


window.onload = runTests;
