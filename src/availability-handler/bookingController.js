const {TimeSlotFinder} = require("./timeSlotFinder")
const {TimeSlotController} = require("./timeSlotController")

class BookingController {
    constructor() {
    }
    processMessage(message) {
        const timeSlotFinder = new TimeSlotFinder();
        const timeSlotController = new TimeSlotController();

        const promise = new Promise ((resolve, reject) => {
            resolve(timeSlotFinder.checkAvailability(message))
        })
        setTimeout(() =>
        {
            promise.then((value) => {
                console.log(value)
            })
        })

    }
}
module.exports.BookingController = BookingController