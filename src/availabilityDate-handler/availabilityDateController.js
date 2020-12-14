const fs = require("fs");
const {Publisher} = require("../services/publisher")

class AvailabilityDateController {
    constructor() {
        this.publisher = new Publisher();
    }

    initiateAvailabilityPerDay() {

        this.publisher.publishAvailabilityForDate('2020-12-14', 'EINS IM CHAT')
        this.getAvailabilityForClinicForDate(1, '2020-12-15')

    }

    getAvailabilityForClinicForDate(clinicId, date) {
        let fileName = './availability-data/availability-' + clinicId +'.json'
        try {
            fs.readFile (fileName, (err, data) => {
                let availability = JSON.parse(data).availability;
                let timeslotArray = availability[0][date]

                console.log(availability)

            })

        } catch(err) {
            console.error(err)
        }
    }
}
module.exports.AvailabilityDateController = AvailabilityDateController