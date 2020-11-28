const {MQTT} = require('./mqttConnector');
const variables = require("../config/variables");
const {AvailabilityController} = require("../availability-handler/availabilityController");

class BrokerListener {
    constructor() {
    }
    listenForMessage() {
        MQTT.on('message', function (topic, message) {
            if (topic === variables.DENTIST_TOPIC) {
                const availabilityController = new AvailabilityController();
                availabilityController.processMessage(message);
            }
        })
    }
}
module.exports.BrokerListener = BrokerListener
