class NetworkManager {
    static freeze(perceptron) {
        return JSON.stringify(perceptron);
    }

    static revive(jsonString) {
        return JSON.parse(jsonString, NetworkManager.reviver);
    }

    static reviver(key, value) {
        if (value && value.__type === 'Cell') {
            return Cell.fromJSON(value);
        }
        if (value && value.__type === 'Perceptron') {
            return Perceptron.fromJSON(value);
        }
        return value;
    }
}
