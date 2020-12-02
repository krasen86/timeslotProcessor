const {MQTT} = require('./mqttConnector');
const variables = require("../config/variables");
const {AvailabilityController} = require("../availability-handler/availabilityController");
const {BookingController} = require("../availability-handler/bookingController");

class BrokerListener {
    constructor() {
    }
    listenForMessage() {
        MQTT.on('message', function (topic, message) {
            if (topic === variables.DENTIST_TOPIC) {
                const availabilityController = new AvailabilityController();
                availabilityController.processMessage(message);
            }
            if(topic === variables.BOOKING_TOPIC) {
                const bookingController = new BookingController();
                bookingController.processMessage(message);
            }
        })
    }
}
module.exports.BrokerListener = BrokerListener
