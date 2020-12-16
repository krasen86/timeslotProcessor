const {TimeSlotController} = require("./timeSlotController")
const {Publisher} = require ("../services/publisher")

class BookingController {
    constructor() {
    }
    processMessage(message) {
        const timeSlotController = new TimeSlotController();
        const publisher = new Publisher();

        async function timeSlotAvailable() {
            const result = await timeSlotController.checkAvailability(message);
            if(result.available === true) {
                timeSlotController.takeTimeSlot(result)
            }
            publisher.publishBookingConfirmation(result)
        }
        timeSlotAvailable();
    }
}
module.exports.BookingController = BookingController