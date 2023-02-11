class Cell
{
	constructor(layer, isBias = false, isRecurrent = false) {
		this.setInput(0);
		this.setOutput(0);
		this.setTargetOutput(null);
		this.error = 0;
		this.derivative = 0;
		this.layer = layer;
		this.isBias = isBias;
		this.isRecurrent = isRecurrent;
	}

	setInput(input) {
		this.input = input;
	}

	setOutput(output) {
		this.output = output;
	}

	setTargetOutput(targetOutput) {
		this.targetOutput = targetOutput;
	}

	setError(error) {
		this.error = error;
	}

	getError() {
		return this.error;
	}

	getDerivative() {
		return this.derivative;
	}

	getTargetOutput() {
		return this.targetOutput;
	}

	calcError() {
		// this.error = 0.5 * Math.pow(this.targetOutput - this.getOutput(), 2);
		this.error = this.targetOutput - this.getOutput();
	}


	getOutput() {
		return this.output;
	}

	calcOutput(inputSum) {
		if (this.isBias) {
			this.setOutput(1);
		} else if (this.layer === 0) {
			this.setOutput(inputSum);
		} else {
			this.setOutput(1 / (1 + Math.pow(2.718, -1 * inputSum)));
		}

		this.derivative = this.getOutput() * (1 - this.getOutput());

		return this.getOutput();
	}

}