const {TimeSlotFinder} = require("./timeSlotFinder")
const {TimeSlotController} = require("./timeSlotController")

class BookingController {
    constructor() {
    }
    processMessage(message) {
        const timeSlotFinder = new TimeSlotFinder();
        const timeSlotController = new TimeSlotController();

        async function timeSlotAvailable() {
            console.log('\nbefore checking for availability');
            const result = await timeSlotFinder.checkAvailability(message);
            console.log(result);
        }

        timeSlotAvailable();

    }
}
module.exports.BookingController = BookingController