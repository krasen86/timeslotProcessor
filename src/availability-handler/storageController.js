const fs = require("fs");
const {Publisher} = require( "../dentist-watcher/publisher");
const {Watcher} = require( "../dentist-watcher/watcher");


class StorageController {
    constructor() {
    }

    storeClinics(document) {
        for (var i = 0 ; i < document.length ; i++) {
            var clinic = document[i];
            this.saveClinic(clinic)
        }
    }

    saveClinic(clinic) {
        var dir = './availability-data'
        let publisher = new Publisher();
        let watcher = new Watcher();
        let fileName = './availability-data/availability-' + clinic.id +'.json'

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(fileName, JSON.stringify(clinic));
        publisher.publishTimeSlots(fileName);
        watcher.watch(fileName);
    }
}
module.exports.StorageController = StorageController