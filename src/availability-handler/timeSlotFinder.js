const fs = require("fs")

class TimeSlotFinder {
    constructor() {
    }
    checkAvailability(message) {
        let booking = JSON.parse(message);
        const file = "./availability-data/availability-" + booking.dentistid + ".json";
        const bookingHour = booking.time.split(" ")[1];
        const bookingDate = booking.time.split(" ")[0];

        return new Promise((resolve, reject) => {
            fs.readFile (file, (err, data) => {
                const availability = JSON.parse(data)
                let flag = false;
                let i = 0;
                let date = "";
                let timeslot = false;
                while (flag === false) {
                    if(availability.availability[i] === undefined) {
                        flag = true
                    }
                    if (availability.availability[i].hasOwnProperty(bookingDate)) {
                        date = availability.availability[i];
                        flag = true;
                    } else {
                        i++
                    }
                }
                if(flag === true) {
                    for (let j = 0; j < date[bookingDate].length; j++) {
                        var hour = (Object.keys(date[bookingDate][j])[0]).split(" -")[0]
                        if (hour === bookingHour) {
                            console.log("it works!")
                            timeslot = true
                        }
                    }
                }
                resolve(timeslot)
            })
        })
    }
}
module.exports.TimeSlotFinder = TimeSlotFinder