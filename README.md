

# Neuro-JS

Neuro-JS is a lightweight JavaScript library for creating and training neural networks using backpropagation. It is designed for simplicity and flexibility, making it easy to experiment with different network configurations directly in the browser.

## Features

Layered Neural Networks: Fully customizable multilayer perceptrons.
Built-in Activation Functions: Includes sigmoid, ReLU, leaky ReLU, tanh, and linear functions.
Customizable Training: Adjustable learning rate and error thresholds.
Browser-Friendly: Pure JavaScript implementation, no external dependencies.
Manual and Automatic Weight Initialization: Supports user-defined weights or auto-initialization.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

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
        <script type="text/javascript" src="main.js"></script>
</body>
```

Or use **index.html** from neuro-js project directory.

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

activation function ('sigmoid' by default, 'relu', 'leakyrelu', 'tanh'):
```
perceptron.createLayers([{'size': 2}, {'size': 2, 'activation': 'relu'}, {'size': 1}]);
```

you can add recurrent layer, by adding type 'recurrent':
```
perceptron.createLayers([{'size': 2}, {'size': 2, 'type': recurrent}, {'size': 1}]);
```


_2 input neurones for 1st layer, 2 hidden neurones for 2nd layer and 1 output neuron in last 3rd layer. Neurones will be linked automatically._


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
 
