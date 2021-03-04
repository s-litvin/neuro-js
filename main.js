let perceptron = new Perceptron();

perceptron.addNeuron(new Cell(), 'i1', 1);
perceptron.addNeuron(new Cell(), 'i2', 1);
perceptron.addNeuron(new Cell(), 'n1', 2);
perceptron.addNeuron(new Cell(), 'n2', 2);
perceptron.addNeuron(new Cell(), 'o1', 3);

perceptron.link('i1', 'n1');
perceptron.link('i1', 'n2');
perceptron.link('i2', 'n1');
perceptron.link('i2', 'n2');
perceptron.link('n1', 'o1');
perceptron.link('n2', 'o1');

let inputNeuron1 = perceptron.getNeuron('i1');
let inputNeuron2 = perceptron.getNeuron('i2');

inputNeuron1.cell.setInput(1);
inputNeuron2.cell.setInput(1);

perceptron.updateNeuron('i1', inputNeuron1);
perceptron.updateNeuron('i2', inputNeuron2);

perceptron.forwardPass();
