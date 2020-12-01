const {MQTT} = require("./mqttConnector")
const fs = require("fs")
const variables = require("../config/variables")

class Publisher {
    constructor() {
    }
    publishTimeSlots(file) {

        fs.readFile(file, (err, data) => {
            const clinic = data.toString('utf-8');
            let clinicId = JSON.parse(clinic).id;
            let availability = JSON.parse(clinic).availability

            MQTT.publish(variables.AVAILABILITY_TOPIC + "/" + clinicId, JSON.stringify(availability), {retain:true});
        })
    }
    publishBookingConfirmation(booking) {
        delete booking.datePos
        delete booking.hourPos
        console.log(booking)
        MQTT.publish(variables.BOOKING_RESPONSE_TOPIC, JSON.stringify(booking), {retain:true})
    }
}
module.exports.Publisher = Publisher;


