const fs = require("fs");
const {Publisher} = require("../services/publisher")

class AvailabilityDateController {
    constructor() {
        this.publisher = new Publisher();
    }

    initiateAvailabilityPerDay() {
        const availabilityDir = './availability-data/';
        let clinicsNumber = fs.readdirSync(availabilityDir).length;
        var dateObj = new Date(Date.now())
        let availabilityObject = {}

        for(var j = 0; j<365; j++) {

            var repeatDate = dateObj.setDate(dateObj.getDate() + 1)
            var repeats = new Date(repeatDate)

            var date = repeats.toISOString().split('T')[0]

            var weekDay = repeats.getDay()

            //check if day is saturday or sunday
            if(weekDay !== 6 && weekDay !== 0) {
                 availabilityObject = this.getAvailabilityForAllClinicsForDate(clinicsNumber, date);
            } else {
                availabilityObject =  this.getUnavailableForAllClinics(3)
            }
            this.publisher.publishAvailabilityForDate(date, JSON.stringify(availabilityObject));
        }
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

module.exports.AvailabilityDateController = AvailabilityDateController
