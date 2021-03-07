class Cell
{
	constructor() {
		this.setInput(0);
		this.setOutput(0);
		this.setTargetOutput(null);
		this.error = 0;
		this.derivative = 0;
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
		this.setOutput(1 / (1 + Math.pow(2.718, -1 * inputSum)));
		this.derivative = this.getOutput() * (1 - this.getOutput());

		return this.getOutput();
	}

}