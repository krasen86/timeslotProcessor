const {Publisher} = require( "../dentist-watcher/publisher");
const fs = require("fs");

class Watcher {
    constructor() {
    }
    watch(file) {
        fs.watchFile('../availability-data/' + file, () => {
            let publisher = new Publisher();
            publisher.publishToBroker(file);
        })
    }
}

module.exports.Watcher = Watcher;