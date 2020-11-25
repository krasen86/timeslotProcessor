const {MQTT} = require("./mqttConnector")
const fs = require("fs")
const variables = require("../config/variables")

class Publisher {
    constructor() {
    }
    publishToBroker(file) {

        fs.readFile(file, (err, data) => {

            const clinic = data.toString('utf-8');
            let clinicId = clinic.id;
            console.log(JSON.parse(clinic));

            MQTT.publish(variables.AVAILABILITY_TOPIC + "/" + clinicId, clinic, {retain:true});
        })
    }
}
module.exports.Publisher = Publisher;


