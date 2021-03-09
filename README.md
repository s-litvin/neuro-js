

# Neuro-JS

Another one native JS implementation of neural network algorithm using backpropagation learning.


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

2. Add neurons to perceptron (_isInput flag, id, layer id, bias_). New layer will be created automatically if its not exists.
```
perceptron.addNeuron(new Cell(true), 'input1', 1);
perceptron.addNeuron(new Cell(), 'hidden1', 2, 0.5);
perceptron.addNeuron(new Cell(), 'hidden2', 2, 1);
perceptron.addNeuron(new Cell(), 'output1', 3);
```
3. Link neurons with each other using **_linkAll()_** or **_link(id1, id2)_**.
``` 
perceptron.linkAll();
```
or for individual links:
```
perceptron.link('input1', 'hidden1');
perceptron.link('input1', 'hidden2');
perceptron.link('hidden1', 'output1');
perceptron.link('hidden2', 'output1');
```

4. Set input and target output vectors.
```
perceptron.setInputVector([0.61, 0.12, 0.45, 0.23, 0.29]);
perceptron.setOutputVector([0.91, 0.1, 0.2]);
```

Now you hawe simple perceptron:
``` 
            (hidden1)
__(input1)_/         \_(output1)__
           \        /
            (hidden2)
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
 
