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
    writeLog("Starting tests...");
    try {
        logResult("Basic test 1: Forward Pass", testForwardPass());
        writeLog("Basic test 1: Forward Pass completed.", "success");

        logResult("Basic test 2: Backpropagation", testBackPropagation());
        writeLog("Basic test 2: Backpropagation completed.", "success");

        logResult("Basic test 3: Weights", testGetWeights());
        writeLog("Basic test 3: Weights completed.", "success");

        logResult("Test 4: ForwardPass. Sigmoid", testForwardPassSigmoid());
        writeLog("Test 4: ForwardPass. Sigmoid completed.", "success");

        logResult("Test 5: ForwardPass. RELU", testForwardPassRELU());
        writeLog("Test 5: ForwardPass. RELU completed.", "success");

        logResult("Test 6: ForwardPass. LEAKYRELU", testForwardPassLeakyRELU());
        writeLog("Test 6: ForwardPass. LEAKYRELU completed.", "success");

        logResult("Test 7: ForwardPass. TANH", testForwardPassTanh());
        writeLog("Test 7: ForwardPass. TANH completed.", "success");

        logResult("Test 8: Backpropagation Complex", testBackPropagationComplex());
        writeLog("Test 8: Backpropagation Complex completed.", "success");

        logResult("Test 9: Benchmark", testMultiInputOutputBenchmark());
        writeLog("Test 9: Benchmark completed.", "success");

        logResult("Test 10: Regression", testRegression());
        writeLog("Test 10: Regression completed.", "success");

        writeLog("All tests completed successfully!", "success");
    } catch (error) {
        console.error(error);
        const resultContainer = document.getElementById("test-results");
        resultContainer.textContent = `Error running tests: ${error.message}`;
        writeLog(`Error: ${error.message}`, "error");
    }
}

function writeLog(message, type = "log") {
    const logContainer = document.getElementById("log-container");
    const logMessage = document.createElement("div");
    logMessage.className = `log-message ${type}`;
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
    logContainer.scrollTop = logContainer.scrollHeight;
    console.log(message);
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
        { size: 2, activation: Cell.LINEAR },
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
        { size: 2, activation: Cell.LINEAR },
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
        { size: 2, activation: Cell.LINEAR },
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
        { size: 2, activation: Cell.LINEAR },
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

function testBackPropagationComplex() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 3, activation: Cell.LINEAR },
        { size: 2, activation: Cell.SIGMOID },
        { size: 1, activation: Cell.LINEAR }
    ], false);

    perceptron.link('x00', 'h10', 0.1);
    perceptron.link('x00', 'h11', -0.2);
    perceptron.link('x01', 'h10', 0.4);
    perceptron.link('x01', 'h11', 0.3);
    perceptron.link('x02', 'h10', -0.5);
    perceptron.link('x02', 'h11', 0.6);

    perceptron.link('h10', 'y20', 0.7);
    perceptron.link('h11', 'y20', -0.1);

    perceptron.setInputVector([1.0, 0.5, 0.2]);
    perceptron.setOutputVector([0.8]);

    perceptron.forwardPass();
    perceptron.backPropagation();

    const weights = perceptron.getWeights();

    assert(
        Math.abs(weights[1][0].weights[0].weight - 0.7257) < 0.0001,
        `Expected weight h10->y20 to be 0.7257, got ${weights[1][0].weights[0].weight}`
    );

    assert(
        Math.abs(weights[1][1].weights[0].weight - -0.0759) < 0.0001,
        `Expected weight h11->y20 to be -0.0759, got ${weights[1][1].weights[0].weight}`
    );

    return true;
}

function testMultiInputOutputBenchmark() {
    writeLog("Starting benchmark test with 5 inputs and 3 outputs...")

    // 1. Train data
    const trainingData = [
        { inputs: [0.1, 0.2, 0.3, 0.4, 0.5], outputs: [0.14, 0.26, 0.35] },
        { inputs: [0.5, 0.4, 0.3, 0.2, 0.1], outputs: [0.33, 0.29, 0.07] },
        { inputs: [0.9, 0.8, 0.7, 0.6, 0.5], outputs: [0.58, 0.64, 0.35] },
        { inputs: [0.3, 0.1, 0.4, 0.7, 0.2], outputs: [0.11, 0.33, 0.14] },
        { inputs: [0.7, 0.6, 0.5, 0.4, 0.3], outputs: [0.41, 0.46, 0.21] }
    ];

    // 2. Neural Network setup
    const perceptron = new Perceptron(0.1, 0.00001);
    perceptron.createLayers([
        { size: 5, activation: Cell.LINEAR },  // Input layer
        { size: 9, activation: Cell.SIGMOID },  // Hidden layer
        { size: 3, activation: Cell.LINEAR }    // Output layer
    ]);

    // 3. Training
    writeLog("Training...");
    const epochs = 1000;
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let data of trainingData) {
            perceptron.setInputVector(data.inputs);
            perceptron.setOutputVector(data.outputs);
            perceptron.forwardPass();
            perceptron.backPropagation();
        }

        if (epoch % 100 === 0 || epoch === epochs - 1) {
            writeLog(`Epoch: ${epoch}, Net Error: ${perceptron.getNetError().toFixed(7)}`);
        }
    }

    // 4. Testing
    writeLog("\nTesting...");
    let allPassed = true;
    for (let data of trainingData) {
        perceptron.setInputVector(data.inputs);
        perceptron.forwardPass();
        const outputs = perceptron.getOutputVector();

        writeLog(`Input: ${data.inputs}`);
        writeLog(`Output: ${outputs.map(o => o.toFixed(3))}`);
        writeLog(`Expected: ${data.outputs}`);

        // Accuracy checking
        const isCloseEnough = outputs.every((output, index) =>
            Math.abs(output - data.outputs[index]) < 0.05
        );

        if (!isCloseEnough) {
            allPassed = false;
            writeLog(`Test failed for input: ${data.inputs}`);
        } else {
            writeLog(`Test successful for input: ${data.inputs}`);
        }
    }

    if (allPassed) {
        writeLog("All tests passed!");
        return true;
    } else {
        writeLog("Some tests failed.");
        return false;
    }
}

function testRegression() {
    writeLog("Starting regression test with normalized data...");

    // Normalized training data (inputs scaled to [0, 1], targets scaled to [0, 1])
    const trainingData = [
        {input: [0], target: [0]},         // input: 0, target: 1
        {input: [0.25], target: [0.25]},  // input: 1, target: 3
        {input: [0.5], target: [0.5]},    // input: 2, target: 5
        {input: [0.75], target: [0.75]},  // input: 3, target: 7
        {input: [1], target: [1]}         // input: 4, target: 9
    ];

    // Create perceptron
    const perceptron = new Perceptron(0.1, 0.0001);
    perceptron.createLayers([
        {size: 1, activation: Cell.LINEAR},  // Input layer
        {size: 3, activation: Cell.RELU},   // Hidden layer
        {size: 1, activation: Cell.LINEAR}  // Output layer
    ]);

    // Training
    writeLog("Training...");
    const epochs = 200;
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let data of trainingData) {
            perceptron.setInputVector(data.input);
            perceptron.setOutputVector(data.target);
            perceptron.forwardPass();
            perceptron.backPropagation();
        }

        if (epoch % 100 === 0 || epoch === epochs - 1) {
            writeLog(`Epoch: ${epoch}, Net Error: ${perceptron.getNetError().toFixed(7)}`);
        }
    }

    // Testing
    writeLog("\nTesting regression results...");
    const testData = [
        {input: [0.125], expected: [0.125]}, // input: 0.5, target: 2.5
        {input: [0.375], expected: [0.375]}, // input: 1.5, target: 4.5
        {input: [0.625], expected: [0.625]}, // input: 2.5, target: 6.5
        {input: [0.875], expected: [0.875]}  // input: 3.5, target: 8.5
    ];

    let allPassed = true;
    for (let data of testData) {
        perceptron.setInputVector(data.input);
        perceptron.forwardPass();
        const output = perceptron.getOutputVector();

        writeLog(`Input: ${data.input}`);
        writeLog(`Output: ${output.map(o => o.toFixed(3))}`);
        writeLog(`Expected: ${data.expected}`);

        const isCloseEnough = Math.abs(output[0] - data.expected[0]) < 0.05;
        if (!isCloseEnough) {
            allPassed = false;
            writeLog(`Test failed for input: ${data.input}`);
        } else {
            writeLog(`Test successful for input: ${data.input}`);
        }
    }

    if (allPassed) {
        writeLog("Regression test with normalized data passed!");
        return true;
    } else {
        writeLog("Regression test with normalized data failed.");
        return false;
    }
}



window.onload = runTests;
