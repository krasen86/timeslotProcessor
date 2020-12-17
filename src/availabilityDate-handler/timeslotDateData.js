const fs = require("fs");

class TimeslotDateData {
    constructor() {
    }

    getUnavailableForAllClinics(clinicsNumber){
        let response = {};
        for (let i = 1; i <= clinicsNumber; i++) {
            response["id" + i] = false;
        }
        return response
    }

    getAvailabilityForAllClinicsForDate(clinicsNumber, date) {
        let response = {};
        for (let i = 1; i <= clinicsNumber; i++) {
            response["id" + i] = this.getAvailabilityForClinicForDate(i, date);
        }
        return response
    }

    getAvailabilityForClinicForDate(clinicId, date) {
        let fileName = './availability-data/availability-' + clinicId + '.json'
        try {
            let data = fs.readFileSync(fileName);
            console.log('availability file read')
            let availabilityArray = JSON.parse(data).availability;
            let dateObject = availabilityArray.find(obj => obj.date === date);
            let response = dateObject.timeslots.some((timeSlot) => {
                return timeSlot.availableDentists >= 1;
            })
            return response
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports.TimeslotDateData = TimeslotDateData
