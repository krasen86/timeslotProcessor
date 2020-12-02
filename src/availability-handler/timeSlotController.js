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
                const availability = JSON.parse(data)
                let flag = false;
                let i = 0;
                let date = "";

                while (!flag) {
                    if(availability.availability[i] === undefined) {
                        break;
                    }
                    if (availability.availability[i].hasOwnProperty(bookingDate)) {
                        date = availability.availability[i];
                        flag = true;
                    } else {
                        i++
                    }
                }
                if(flag) {

                    for (let j = 0; j < date[bookingDate].length; j++) {
                        var hour = (Object.keys(date[bookingDate][j])[0]).split(" -")[0]

                        if (hour === bookingHour) {
                            const hourKey = Object.keys(date[bookingDate][j])
                            const availabilityKey = date[bookingDate][j][hourKey]

                            if(availabilityKey > 0){
                                booking.available = true;
                                booking.datePos = i;
                                booking.hourPos = j;
                                break;
                            }

                        } else {
                            booking.available = false;
                        }
                    }
                }
                if(!flag) {
                    booking.available = false;
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