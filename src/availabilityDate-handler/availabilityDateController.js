const fs = require("fs");
const {Publisher} = require("../services/publisher")

class AvailabilityDateController {
    constructor() {
        this.publisher = new Publisher();
    }

    initiateAvailabilityPerDay() {

        const availabilityDir = './availability-data/';
        let clinicsNumber = 3;
        // fs.readdir(availabilityDir, (err, files) => {
        //     return files.length
        // })
        let response = this.getAvailabilityForAllClinicsForDate(clinicsNumber, '2020-12-15');

        response.then(res => {
            console.log('final response: ' + res);
            this.publisher.publishAvailabilityForDate('2020-12-15', res);
        })

    }

    getAvailabilityForAllClinicsForDate(clinicsNumber, date) {
        return new Promise ((resolve) => {
            let response = '';
            for (let i = 1; i <= clinicsNumber; i++) {
                let isAvailable =  this.getAvailabilityForClinicForDate(i, '2020-12-15');
                isAvailable.then(res => {
                    response += i + ' ' + res + ' '
                    console.log(response)
                }).catch(err => {
                    console.log(err);
                })
            }
            resolve(response)
        })
    }

    getAvailabilityForClinicForDate(clinicId, date) {
        let fileName = './availability-data/availability-' + clinicId +'.json'
        try {
            return new Promise((resolve) => {
                fs.readFile(fileName, (err, data) => {
                    let availability = JSON.parse(data).availability;
                    let timeslotArray = availability[0][date];


                    let response = timeslotArray.some((timeSlot, index) => {
                        return Object.values(timeslotArray[index]) >= 1;
                    })

                    console.log(response);
                    resolve(response.toString());
                })
            })
        } catch(err) {
            console.error(err);
        }
    }
}
module.exports.AvailabilityDateController = AvailabilityDateController