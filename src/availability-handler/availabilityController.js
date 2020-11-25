const Variables = require("../config/variables");
const {TimeSlotCreator} = require("./timeSlotCreator");
const {StorageController} = require("./storageController");


class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');
        const timeSlotCreator = new TimeSlotCreator();
        const storageController = new StorageController();

        const populatedClinics = timeSlotCreator.populateAvailability(buffer);
        storageController.storeClinics(populatedClinics);
    }
}
module.exports.AvailabilityController = AvailabilityController