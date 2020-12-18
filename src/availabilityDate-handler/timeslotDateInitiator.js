const fs = require("fs");
const {Publisher} = require("../services/publisher")
const {TimeslotDateData} = require("./timeslotDateData")

class TimeslotDateInitiator {
    constructor() {
        this.publisher = new Publisher();
        this.timeslotDateData = new TimeslotDateData();
    }

    initiateAvailabilityPerDay() {
        const availabilityDir = './availability-data/';
        let clinicsNumber = fs.readdirSync(availabilityDir).length;
        let dateObj = new Date(Date.now())
        let availabilityObject = {}

        for(let i = 0; i<365; i++) {

            let repeatDate = dateObj.setDate(dateObj.getDate() + 1);
            let repeats = new Date(repeatDate)

            let date = repeats.toISOString().split('T')[0];

            let weekDay = repeats.getDay();

            //check if day is saturday or sunday
            if(weekDay !== 6 && weekDay !== 0) {
                 availabilityObject = this.timeslotDateData.getAvailabilityForAllClinicsForDate(clinicsNumber, date);
            } else {
                availabilityObject =  this.timeslotDateData.getUnavailableForAllClinics(clinicsNumber);
            }
            this.publisher.publishAvailabilityForDate(date, JSON.stringify(availabilityObject));
        }
    }
}

module.exports.TimeslotDateInitiator = TimeslotDateInitiator
