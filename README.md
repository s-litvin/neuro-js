

# Neuro-JS

Neuro-JS is a lightweight JavaScript library for creating and training neural networks using backpropagation. It is designed for simplicity and flexibility, making it easy to experiment with different network configurations directly in the browser.

## Features

- **Layered Neural Networks**: Fully customizable multilayer perceptrons.
- **Built-in Activation Functions**: Includes sigmoid, ReLU, leaky ReLU, tanh, and linear functions.
- **Customizable Training**: Adjustable learning rate and error thresholds.
- **Browser-Friendly**: Pure JavaScript implementation, no external dependencies.
- **Manual and Automatic Weight Initialization**: Supports user-defined weights or auto-initialization.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to download Neuro-JS project. 

```
git clone https://github.com/s-litvin/neuro-js.git
```

### Installing

Include Neuro-JS to your html-page

```
<body>
        ...
        <script type="text/javascript" src="neuron.js"></script>
        <script type="text/javascript" src="perceptron.js"></script>
</body>
```

Or use **index.html** (demo) from neuro-js project directory.

### Using

1. Create perceptron (with learning rate and error trashold)
```
perceptron = new Perceptron(0.98, 0.001);
```

2. Add neurons using array of neurones numbers for each layer.

createLayers(neuronesCountForEachLayer, linkAutomatically);
```
perceptron.createLayers([{'size': 2}, {'size': 2}, {'size': 1}]);
```

### Activation Functions
Supported activation functions:

- `Sigmoid` (default): f(x) = 1 / (1 + e^(-x))
- `ReLU`: f(x) = max(0, x)
- `Leaky` ReLU: f(x) = x > 0 ? x : 0.01 * x
- `Tanh`: f(x) = (e^x - e^(-x)) / (e^x + e^(-x))
- `Linear`: f(x) = x


activation function (*'sigmoid'* is default):
```
perceptron.createLayers([{'size': 2}, {'size': 2, 'activation': Cell::RELU}, {'size': 1, 'activation': Cell::LINEAR}]);
```
Available activatio types:

- Cell.RELU
- Cell.LEAKYRELU
- Cell.SIGMOID
- Cell.TANH
- Cell.LINEAR


You can add recurrent layer, by adding type 'recurrent':
```
perceptron.createLayers([{'size': 2}, {'size': 2, 'type': Cell.TYPE_RECURRENT}, {'size': 1, 'activation': Cell::LINEAR}]);
```


_2 input neurones for 1st layer, 2 hidden neurones for 2nd layer and 1 output neuron in last 3rd layer. Neurones will be linked automatically._


### Manual neurons linking
### Manual Neuron Linking in Neuro-JS

In **Neuro-JS**, you can manually link neurons instead of relying on automatic linking. To do this, set the second parameter in the `createLayers` method to `false`. By default, this parameter is `true`, enabling automatic linking.

Here is an example demonstrating manual neuron linking:

```javascript
// Create layers with manual linking
perceptron.createLayers([
    { size: 3, activation: Cell.SIGMOID }, // Input layer
    { size: 2, activation: Cell.SIGMOID }, // Hidden layer
    { size: 1, activation: Cell.LINEAR }   // Output layer
], false);

// Manually link neurons with specified weights
perceptron.link('x00', 'h10', 0.1);  // Link input neuron x00 to hidden neuron h10 with weight 0.1
perceptron.link('x00', 'h11', -0.2); // Link input neuron x00 to hidden neuron h11 with weight -0.2
perceptron.link('x01', 'h10', 0.4);
perceptron.link('x01', 'h11', 0.3);
perceptron.link('x02', 'h10', -0.5);
perceptron.link('x02', 'h11', 0.6);

perceptron.link('h10', 'y20', 0.7);  // Link hidden neuron h10 to output neuron y20 with weight 0.7
perceptron.link('h11', 'y20', -0.1); // Link hidden neuron h11 to output neuron y20 with weight -0.1

// Set input and output vectors
perceptron.setInputVector([1.0, 0.5, 0.2]); // Set input values
perceptron.setOutputVector([0.8]);          // Set target output

// Perform forward pass and backpropagation
perceptron.forwardPass();       // Calculate outputs based on inputs
perceptron.backPropagation();   // Adjust weights to reduce error
```

### Neuron Naming Convention

- **Input Neurons (x):** Prefixed with `x`, followed by the layer index (always 0) and the neuron index.  
  Example: `x02` means **input neuron**, layer 0, neuron 3.

- **Hidden Neurons (h):** Prefixed with `h`, followed by the layer index and the neuron index.  
  Example: `h10` means **hidden neuron**, layer 1, neuron 1.

- **Output Neurons (y):** Prefixed with `y`, followed by the layer index and the neuron index.  
  Example: `y20` means **output neuron**, layer 2, neuron 1.

---

To link neurons manually, use the `link` method with the following parameters:
1. **Source neuron ID:** The ID of the neuron from which the link starts (e.g., `x00`).
2. **Target neuron ID:** The ID of the neuron to which the link connects (e.g., `h10`).
3. **Weight:** The weight of the connection.

This approach gives you fine-grained control over the architecture and weight initialization of the neural network.


3. Set input and target output vectors.
```
perceptron.setInputVector([0.61, 0.12]);
perceptron.setOutputVector([0.91]);
```

Now you have simple perceptron:
``` 
--(input1)----(hidden1)
           \/         \_(output1)__
           /\         /
--(input2)----(hidden2)
```

5. Forward pass.
``` 
perceptron.forwardPass();
```

6. Backpropagation.
``` 
perceptron.backPropagation();
```


## Demo
Check demo on GitHub page: https://s-litvin.github.io/neuro-js/

![](https://raw.githubusercontent.com/s-litvin/neuro-js/master/preview.png)
 

### Additional Examples

For more examples, visit the [test page](https://s-litvin.github.io/neuro-js/tests.html). This page provides various test cases demonstrating the capabilities of **Neuro-JS**.

The examples shown on the test page are executed using the `tests.js` file included in the repository. You can explore these examples to understand different ways to configure and train neural networks using this library.