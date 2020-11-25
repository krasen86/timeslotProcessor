const Variables = require("../config/variables");
const {TimeSlotCreator} = require("./timeSlotCreator")


class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');
        const timeSlotCreator = new TimeSlotCreator();

        const populatedClinics = timeSlotCreator.populateAvailability(buffer);

    }


}
module.exports.AvailabilityController = AvailabilityController