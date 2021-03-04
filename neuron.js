class Cell
{
	constructor() {
		this.setInput(0);
		this.setOutput(0);
	}

	setInput(input) {
		this.input = input;
	}

	setOutput(output) {
		this.output = output;
	}

	getOutput() {
		return this.output;
	}

	calcOutput() {
		this.setOutput(1 / (1 + Math.pow(2.718, -1 * this.input)));
		return this.getOutput();
	}

}