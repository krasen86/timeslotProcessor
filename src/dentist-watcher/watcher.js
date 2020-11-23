const {Publisher} = require( "../dentist-watcher/publisher");
const fs = require("fs");

class Watcher {
    constructor() {
    }
    watch() {
        fs.watchFile('./dentist-data/dentists.json', () => {
            let publisher = new Publisher();
            publisher.publishToBroker();
        })
    }
}

module.exports.Watcher = Watcher;