const fs = require("fs");
const {Publisher} = require( "../services/publisher");
const {Watcher} = require( "../services/watcher");


class StorageController {
    constructor() {
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

    saveAvailability(availability, id) {
        let fileName = './availability-data/availability-' + id +'.json'

        fs.readFile(fileName, () => {
            fs.writeFileSync(fileName, JSON.stringify(availability));
        })
    }
}
module.exports.StorageController = StorageController