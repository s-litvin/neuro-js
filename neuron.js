class Cell
{
	static RELU = 'relu';
	static LEAKYRELU = 'leakyrelu';
	static SIGMOID = 'sigmoid';
	static TANH = 'tanh';
	static LINEAR = 'linear';
	static TYPE_RECURRENT = 'recurrent';

	constructor(layer, isBias = false, isRecurrent = false, activation = Cell.SIGMOID) {
		this.setInput(0);
		this.setOutput(0);
		this.setTargetOutput(null);
		this.error = 0;
		this.derivative = 0;
		this.layer = layer;
		this.isBias = isBias;
		this.isRecurrent = isRecurrent;
		this.activation = [Cell.RELU, Cell.LEAKYRELU, Cell.SIGMOID, Cell.TANH, Cell.LINEAR].includes(activation) ? activation : Cell.SIGMOID;
		this.active = true;
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

	setActive(isActive) {
		this.active = isActive;
	}

	isActive() {
		return this.active;
	}


	getOutput() {
		return this.output;
	}

	calcOutput(inputSum) {

		// dropuouts
		if (!this.isActive()) {
			this.setOutput(0);

			return this.getOutput();
		}

		if (this.isBias) {
			this.setOutput(1);
		} else {
			this.setOutput(this.calcActivation(inputSum));
		}

		this.derivative = this.calcDerivative();

		return this.getOutput();
	}

	calcActivation(inputSum) {
		switch (this.activation) {
			case Cell.RELU:
				return inputSum < 0 ? 0 : inputSum;
			case Cell.LEAKYRELU:
				return inputSum < 0 ? 0.1 * inputSum : inputSum;
			case Cell.TANH:
				return (Math.pow(2.718, inputSum) - Math.pow(2.718, -1 * inputSum)) /
					(Math.pow(2.718, inputSum) + Math.pow(2.718, -1 * inputSum));
			case Cell.LINEAR:
				return inputSum;
			case Cell.SIGMOID:
			default:
				return 1 / (1 + Math.pow(2.718, -1 * inputSum));
		}
	}

	calcDerivative() {
		switch (this.activation) {
			case Cell.RELU:
				return this.getOutput() > 0 ? 1 : 0;
			case Cell.LEAKYRELU:
				return this.getOutput() > 0 ? 1 : 0.1;
			case Cell.TANH:
				return 1 - Math.pow(this.getOutput(), 2);
			case Cell.LINEAR:
				return 1;
			case Cell.SIGMOID:
			default:
				return this.getOutput() * (1 - this.getOutput());
		}
	}


}