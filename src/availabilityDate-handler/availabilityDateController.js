const fs = require("fs");
const {Publisher} = require("../services/publisher")

class AvailabilityDateController {
    constructor() {
        this.publisher = new Publisher();
    }

    initiateAvailabilityPerDay() {

        const availabilityDir = './availability-data/';
        let clinicsNumber = 3;
        let date = '2020-12-17';
        // fs.readdir(availabilityDir, (err, files) => {
        //     return files.length
        // })

        let response = this.getAvailabilityForAllClinicsForDate(clinicsNumber, date);

        response.then(res => {
            console.log('final response: ' + JSON.stringify(res));
            this.publisher.publishAvailabilityForDate(date, JSON.stringify(res));
        })

    }

    getAvailabilityForAllClinicsForDate(clinicsNumber, date) {
        return new Promise ((resolve) => {
            let response = {};
            for (let i = 1; i <= clinicsNumber; i++) {
                let availabilityForClinic =  new Promise ((resolve2) => {
                    let isAvailable = this.getAvailabilityForClinicForDate(i, date);
                    isAvailable.then(res => {
                        resolve2(res);
                    }).catch(err => {
                        console.log(err);
                    })
                })
                availabilityForClinic.then( res => {
                    response["Id" + i] = res;
                    if (Object.keys(response).length === clinicsNumber) {
                        resolve(response);
                    }
                })
            }
        })
    }

    getAvailabilityForClinicForDate(clinicId, date) {
        let fileName = './availability-data/availability-' + clinicId +'.json'
        try {
            return new Promise((resolve) => {
                fs.readFile(fileName, (err, data) => {
                    let availabilityArray = JSON.parse(data).availability;

                    let dateObject = availabilityArray.find(obj => obj.date === date);
                    let response = dateObject.timeslots.some((timeSlot) => {
                        return timeSlot.availableDentists >= 1;
                    })

                    console.log('getAvailabilityForClinicForDate: ' + response);
                    resolve(response.toString());
                })
            })
        } catch(err) {
            console.error(err);
        }
    }
}
module.exports.AvailabilityDateController = AvailabilityDateController