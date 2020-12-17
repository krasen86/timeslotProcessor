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
        var dateObj = new Date(Date.now())
        let availabilityObject = {}

        for(var j = 0; j<365; j++) {

            var repeatDate = dateObj.setDate(dateObj.getDate() + 1)
            var repeats = new Date(repeatDate)

            var date = repeats.toISOString().split('T')[0]

            var weekDay = repeats.getDay()

            //check if day is saturday or sunday
            if(weekDay !== 6 && weekDay !== 0) {
                 availabilityObject = this.timeslotDateData.getAvailabilityForAllClinicsForDate(clinicsNumber, date);
            } else {
                availabilityObject =  this.timeslotDateData.getUnavailableForAllClinics(3)
            }
            this.publisher.publishAvailabilityForDate(date, JSON.stringify(availabilityObject));
        }
    }
}

module.exports.TimeslotDateInitiator = TimeslotDateInitiator
