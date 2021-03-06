// --(i1)--(n1)
//       \/    \__(o1)
//       /\    /
// --(i2)--(n2)

let perceptron = new Perceptron();

// Creating neurones
perceptron.addNeuron(new Cell(), 'i1', 1);
perceptron.addNeuron(new Cell(), 'i2', 1);
perceptron.addNeuron(new Cell(), 'n1', 2);
perceptron.addNeuron(new Cell(), 'n2', 2);
perceptron.addNeuron(new Cell(), 'o1', 3);

// Linking neurones
perceptron.link('i1', 'n1', 0.3);
perceptron.link('i1', 'n2', 0.32);
perceptron.link('i2', 'n1', 0.41);
perceptron.link('i2', 'n2', 0.2);
perceptron.link('n1', 'o1', 0.7);
perceptron.link('n2', 'o1', 0.2);

// Set inputs and target outputs
let inputNeuron1  = perceptron.getNeuron('i1');
let inputNeuron2  = perceptron.getNeuron('i2');
let outputNeuron1 = perceptron.getNeuron('o1');

inputNeuron1.cell.setInput(0.5);
inputNeuron2.cell.setInput(0.33);
outputNeuron1.cell.setTargetOutput(0.1);

perceptron.updateNeuron('i1', inputNeuron1);
perceptron.updateNeuron('i2', inputNeuron2);
perceptron.updateNeuron('o1', outputNeuron1);

// Forward pass
perceptron.forwardPass();

// Learning
perceptron.backPropagation();

console.log(perceptron);
