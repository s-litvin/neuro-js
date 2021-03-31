class Perceptron
{
	constructor(learningRate = 0.1, errorTrashhold = 0.0001) {
		this.cells = [];
		this.layers = [];
		this.totalError = 0;
		this.learningRate = learningRate;
		this.errorTrashold = errorTrashhold;
		this.resetEpoch();
	}

	getLearningRate() {
		return this.learningRate;
	}

	getErrorTrashold() {
		return this.errorTrashold;
	}

	getEpoch() {
		return this.epoch;
	}

	resetEpoch() {
		this.epoch = 0;
	}

	getNetError() {
		return this.totalError;
	}

	addNeuron(cell, id, layer) {
		this.cells.push({'id': id, 'cell': cell, 'links': [], 'layer': layer + 0});
		this.indexLayers();
	}

	updateNeuron(id, cell) {
		this.cells[this.findNeuronIndexById(id)] = cell;
		this.indexLayers();
	}

	getNeuron(id) {
		return this.cells[this.findNeuronIndexById(id)];
	}

	findNeuronIndexById(id) {
		return this.cells.findIndex(cell => cell.id === id);
	}

	getNeuronsByLayer(layer) {
		return this.cells.filter(cell => cell.layer === layer);	
	}

	indexLayers() {
		this.layers = [];
		for (let i = 0; i < this.cells.length; i++) {
			if (!this.layers.includes(this.cells[i].layer)) {
				this.layers.push(this.cells[i].layer);
			}
		}
		this.layers.sort();
	}

	getNeuronLinks(neuron, linkType) {
		let neurons = [];
		let links = neuron.links.filter(link => link.type === linkType);
		for (let i = 0; i < links.length; i++) {
			neurons.push({'neuron': this.getNeuron(links[i].id), 'weight':links[i].weight});
		}
		return neurons;
	}

	link(id1, id2, weight = Math.random()) {
		let n1 = this.getNeuron(id1);
		let n2 = this.getNeuron(id2);
		n1.links.push({'id': id2, 'weight': weight, 'type': 'right'});
		n2.links.push({'id': id1, 'weight': weight, 'type': 'left'});
		this.updateNeuron(id1, n1);
		this.updateNeuron(id2, n2);
	}

	unlink(id1, id2) {
		let n1 = this.getNeuron(id1);
		let n2 = this.getNeuron(id2);
		n1.links = n1.links.filter(link => link.id !== id2);
		n2.links = n2.links.filter(link => link.id !== id1);
		this.updateNeuron(id1, n1);
		this.updateNeuron(id2, n2);
	}

	linkAll() {
		for (let layer = 0; layer < this.layers.length - 1; layer++) {

			let neuronesLeft  = this.getNeuronsByLayer(this.layers[layer]);
			let neuronesRight = this.getNeuronsByLayer(this.layers[layer + 1]);

			for (let i = 0; i < neuronesLeft.length; i++) {
				let nl = this.getNeuron(neuronesLeft[i].id);

				for (let j = 0; j < neuronesRight.length; j++) {
					let nr = this.getNeuron(neuronesRight[j].id);
					if (nr.cell.isBias) {
						continue;
					}
					this.link(nl.id, nr.id);
				}
			}
		}
	}

	createLayers(neuronsCountArray, linkAutomatically = true) {
		for (let layer = 0; layer < neuronsCountArray.length; layer++) {
			for (let number = 0; number < neuronsCountArray[layer]; number++) {
				let letter = 'h';
				if (layer === 0) {
					letter = 'x';
				} else if (layer === neuronsCountArray.length - 1) {
					letter = 'y';
				}
				this.addNeuron(new Cell(layer), letter + layer + number, layer);
			}

			if (layer !== neuronsCountArray.length - 1) {
				// Bias neuron
				this.addNeuron(new Cell(layer, true), 'b' + layer + neuronsCountArray[layer], layer);
			}
		}

		if (linkAutomatically) {
			this.linkAll();
		}
	}

	setInputVector(inputsArray) {
		let firstLayerNeurones = this.getNeuronsByLayer(this.layers[0]);

		for (let i = 0; i < firstLayerNeurones.length; i++) {
			let neuron = firstLayerNeurones[i];
			if (neuron.cell.isBias) {
				continue;
			}
			neuron.cell.setInput(inputsArray[i]);
			this.updateNeuron(neuron.id, neuron);
		}
	}

	setOutputVector(outputArray) {
		let lastLayerNeurones = this.getNeuronsByLayer(this.layers[this.layers.length - 1]);

		for (let i = 0; i < lastLayerNeurones.length; i++) {
			let neuron = lastLayerNeurones[i];
			neuron.cell.setTargetOutput(outputArray[i]);
			this.updateNeuron(neuron.id, neuron);
		}
	}

	forwardPass() {
		
		for (let i = 0; i < this.layers.length; i++) {

			let layer = this.layers[i];
			let neurones = this.getNeuronsByLayer(layer);

			for (let index = 0; index < neurones.length; index++) {
				let neuron = neurones[index];
				let inputSum = neuron.cell.input;
				let leftLinks = this.getNeuronLinks(neuron, 'left');

				for (let li = 0; li < leftLinks.length; li++) {
					inputSum += leftLinks[li].neuron.cell.getOutput() * leftLinks[li].weight;
				}

				neuron.cell.calcOutput(inputSum);

				this.updateNeuron(neuron.id, neuron);
			}
		}
	}

	calcErrors() {

		this.totalError = 0;
		this.epoch++;

		for (let li = this.layers.length - 1; li >= 0; li--) {
			let neurones = this.getNeuronsByLayer(this.layers[li]);

			for (let i = 0; i < neurones.length; i++) {
				let neuron = neurones[i];

				let rightLinks = this.getNeuronLinks(neuron, 'right');

				if (rightLinks.length === 0) { // если это последний слой, то ошибка вычисляется разницей ожидания и выхода
					neuron.cell.setError(neuron.cell.getTargetOutput() - neuron.cell.getOutput());
				} else { // если слой скрытый, то ошибка - сумма ошибок правых узлов умноженных на веса.
					let errorsSum = 0;

					for (let j = 0; j < rightLinks.length; j++) {
						let rightNeuron = rightLinks[j].neuron;
						errorsSum += rightNeuron.cell.getError() * rightLinks[j].weight;
					}

					neuron.cell.setError(errorsSum);
				}

				this.updateNeuron(neuron.id, neuron);

				if (li === this.layers.length - 1) {
					this.totalError += neuron.cell.getError();
				}
			}
		}
	}

	updateWeights() {
		for (let i = 0; i < this.layers.length; i++) {

			let layer = this.layers[i];
			let neurones = this.getNeuronsByLayer(layer);

			for (let index = 0; index < neurones.length; index++) {

				let neuron = neurones[index];
				let rightLinks = this.getNeuronLinks(neuron, 'right');

				for (let j = 0; j < rightLinks.length; j++) {
					let rightNeuron = rightLinks[j].neuron;
					let newWeight = rightLinks[j].weight + rightNeuron.cell.getDerivative() * rightNeuron.cell.getError() * neuron.cell.getOutput() * this.learningRate;
					this.unlink(neuron.id, rightNeuron.id);
					this.link(neuron.id, rightNeuron.id, newWeight)
				}
			}
		}
	}

	backPropagation() {

		if (this.getEpoch() > 1 && this.getErrorTrashold() > Math.abs(this.getNetError())) {
			return false;
		}

		this.calcErrors();
		this.updateWeights();
	}
}