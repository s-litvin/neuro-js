class Perceptron
{
	constructor() {
		this.cells = [];
		this.layers = [];
		this.totalError = 0;
	}

	addNeuron(cell, id, layer) {
		this.cells.push({'id': id, 'cell': cell, 'links': [], 'layer': layer + 0});
		this.indexLayers();
	}

	updateNeuron(id, cell) {
		this.cells[this.findNeuronIndexById(id)] = cell;
		this.indexLayers();
	}

	deleteNeuron(id) {
		this.cells.splice(this.findNeuronIndexById(id), 1);
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

	link(id1, id2, weight = 1) {
		let n1 = this.getNeuron(id1);
		let n2 = this.getNeuron(id2);
		n1.links.push({'id': id2, 'weight': weight, 'type': 'right'});
		n2.links.push({'id': id1, 'weight': weight, 'type': 'left'});
		this.updateNeuron(id1, n1);
		this.updateNeuron(id2, n2);
	}

	forwardPass() {
		
		for (let i = 0; i < this.layers.length; i++) {

			let layer = this.layers[i];
			let neurones = this.getNeuronsByLayer(layer);

			console.log('Layer: ' + layer);

			for (let index = 0; index < neurones.length; index++) {
				let neuron = neurones[index];
				let inputSum = neuron.cell.input;
				let leftLinks = this.getNeuronLinks(neuron, 'left');

				for (let li = 0; li < leftLinks.length; li++) {
					inputSum += leftLinks[li].neuron.cell.getOutput() * leftLinks[li].weight;
				}

				neuron.cell.setInput(inputSum);
				neuron.cell.calcOutput();
				
				this.updateNeuron(neuron.id, neuron);

				console.log(neurones[index]);
				console.log(leftLinks)
			}
		}
	}

	calcErrors() {

		for (let li = this.layers.length - 1; li >= 0; li--) {
			let neurones = this.getNeuronsByLayer(this.layers[li]);

			for (let i = 0; i < neurones.length; i++) {
				let neuron = neurones[i];

				let rightLinks = this.getNeuronLinks(neuron, 'right');

				if (rightLinks.length === 0) { // если это последний слой, то ошибка вычисляется разницей ожидания и выхода
					neuron.cell.setError(neuron.cell.getTargetOutput() - neuron.cell.getOutput());
				} else { // если слой скрытый, то ошибка - сумма ошибок правых узлов умноженных на веса.
					for (let j = 0; j < rightLinks.length; j++) {
						let rightNeuron = rightLinks[j].neuron;
						neuron.cell.setError(neuron.cell.getError() + (rightNeuron.cell.getError() * rightLinks[j].weight));
					}
				}

				this.updateNeuron(neuron.id, neuron);

				if (i === this.layers[this.layers.length]) {
					this.totalError += neuron.cell.getError();
				}
			}
		}
	}

	backPropagation() {
	}
}