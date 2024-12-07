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
        logResult("Test 8: Backpropagation", testBackPropagationComplex());
        logResult("Test 9: Benchmark", testMultiInputOutputBenchmark());
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

function testBackPropagationComplex() {
    const perceptron = new Perceptron(0.1, 0.001);

    perceptron.createLayers([
        { size: 3, activation: Cell.SIGMOID },
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
    console.log("Starting benchmark test with 5 inputs and 3 outputs...");

    // 1. Создание тренировочных данных
    const trainingData = [
        { inputs: [0.1, 0.2, 0.3, 0.4, 0.5], outputs: [0.14, 0.26, 0.35] },
        { inputs: [0.5, 0.4, 0.3, 0.2, 0.1], outputs: [0.33, 0.29, 0.07] },
        { inputs: [0.9, 0.8, 0.7, 0.6, 0.5], outputs: [0.58, 0.64, 0.35] },
        { inputs: [0.3, 0.1, 0.4, 0.7, 0.2], outputs: [0.11, 0.33, 0.14] },
        { inputs: [0.7, 0.6, 0.5, 0.4, 0.3], outputs: [0.41, 0.46, 0.21] }
    ];

    // 2. Настройка сети
    const perceptron = new Perceptron(0.1, 0.00001);
    perceptron.createLayers([
        { size: 5, activation: Cell.SIGMOID },  // Входной слой
        { size: 9, activation: Cell.SIGMOID },  // Скрытый слой
        { size: 3, activation: Cell.LINEAR }    // Выходной слой
    ]);

    // 3. Обучение сети
    console.log("Training...");
    const epochs = 1400;
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let data of trainingData) {
            perceptron.setInputVector(data.inputs);
            perceptron.setOutputVector(data.outputs);
            perceptron.forwardPass();
            perceptron.backPropagation();
        }

        if (epoch % 100 === 0 || epoch === epochs - 1) {
            console.log(`Epoch: ${epoch}, Net Error: ${perceptron.getNetError().toFixed(7)}`);
        }
    }

    // 4. Тестирование сети
    console.log("\nTesting...");
    let allPassed = true;
    for (let data of trainingData) {
        perceptron.setInputVector(data.inputs);
        perceptron.forwardPass();
        const outputs = perceptron.getOutputVector();

        console.log(`Input: ${data.inputs}`);
        console.log(`Output: ${outputs.map(o => o.toFixed(3))}`);
        console.log(`Expected: ${data.outputs}`);

        // Проверка точности
        const isCloseEnough = outputs.every((output, index) =>
            Math.abs(output - data.outputs[index]) < 0.05
        );

        if (!isCloseEnough) {
            allPassed = false;
            console.warn(`Test failed for input: ${data.inputs}`);
        } else {
            console.info(`Test successful for input: ${data.inputs}`);
        }
    }

    if (allPassed) {
        console.log("All tests passed!");
        return true;
    } else {
        console.error("Some tests failed.");
        return false;
    }
}


window.onload = runTests;