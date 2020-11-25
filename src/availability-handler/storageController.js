const fs = require("fs")

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

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync('./availability-data/availability-' + clinic.id +'.json', JSON.stringify(clinic));
    }
}
module.exports.StorageController = StorageController