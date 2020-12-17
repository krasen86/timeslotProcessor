const {TimeSlotController} = require("./timeSlotController");
const {TimeslotDateData} = require("../availabilityDate-handler/timeslotDateData");
const {Publisher} = require ("../services/publisher");

class BookingController {
    constructor() {
        this.timeslotDateData = new TimeslotDateData();
        this.publisher = new Publisher();
    }
    processMessage(message) {
        const timeSlotController = new TimeSlotController();
        let _this = this
        async function timeSlotAvailable() {
            const result = await timeSlotController.checkAvailability(message);
            if(result.available === true) {
                // TODO:  updateAvailabilityForDate is called before timeSlotController.takeTimeSlot is finished
                timeSlotController.takeTimeSlot(result)
                _this.updateAvailabilityForDate(result)
            }
            _this.publisher.publishBookingConfirmation(result)
        }
        timeSlotAvailable();
    }

    updateAvailabilityForDate(booking) {
        let date = booking.time.split(' ')[0]
        let availability =  this.timeslotDateData.getAvailabilityForClinicForDate(booking.dentistid, date);
        console.log('clinic availability: ' + JSON.stringify(availability)) // should be false after the last timeslot has been taken in a day for a clinic

        // when the last timeslot of clinic for a date has been taken it should check the availability for the other clinics for that date ans republish the current availability status
        if (!availability) {
            let availabilityForDate = this.timeslotDateData.getAvailabilityForAllClinicsForDate(date)
            this.publisher.publishAvailabilityForDate(date, availabilityForDate)
        }
    }
}
module.exports.BookingController = BookingController