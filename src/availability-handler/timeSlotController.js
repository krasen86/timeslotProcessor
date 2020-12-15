const {StorageController} = require("./storageController")
const fs = require("fs")

class TimeSlotController {
    constructor() {
    }
    checkAvailability(message) {
        let booking = JSON.parse(message);

        const file = "./availability-data/availability-" + booking.dentistid + ".json";
        const bookingHour = booking.time.split(" ")[1];
        const bookingDate = booking.time.split(" ")[0];

        return new Promise((resolve) => {
            fs.readFile (file, (err, data) => {
                const clinicAvailabilityArray = JSON.parse(data).availability
                let dateObject = clinicAvailabilityArray.find(obj => obj.date === bookingDate);

                booking.available = false;

                if (dateObject !== undefined) {
                    // finds the time Object that corresponds to the booking time
                    let timeObject = dateObject.timeslots.find( obj => obj.time.split(" -")[0] === bookingHour )

                    // checks for available time slots at booking time
                    if (timeObject !== undefined && timeObject.availableDentists > 0) {
                        booking.available = true;
                    }
                }
                resolve(booking)
            })
        })
    }

    takeTimeSlot(booking) {
        const storageController = new StorageController();
        const file = "./availability-data/availability-" + booking.dentistid + ".json";
        const bookingDate = booking.time.split(" ")[0];

        const datePos = booking.datePos;
        const hourPos = booking.hourPos;

        fs.readFile (file, (err, data) => {
            const jsonFile = JSON.parse(data)
            const hour = Object.keys(jsonFile.availability[datePos][bookingDate][hourPos])
            let availability = jsonFile.availability[datePos][bookingDate][hourPos][hour]

            availability--
            jsonFile.availability[datePos][bookingDate][hourPos][hour] = availability;

            storageController.saveAvailability(jsonFile, booking.dentistid)
        })
    }
}
module.exports.TimeSlotController = TimeSlotController