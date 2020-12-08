const fs = require("fs");
const {Publisher} = require("../services/publisher");
const {TimeSlotCreator} = require("./timeSlotCreator");

class ChangeController {
    constructor() {
    }
    checkChange(message) {
        const dentists = JSON.parse(message).dentists
        const timeSlotCreator = new TimeSlotCreator()
        const publisher = new Publisher()

        for(let i=1; i<=dentists.length; i++){
            let fileName = './availability-data/availability-' + dentists[i-1].id +'.json'
            try {
                if (fs.existsSync(fileName)) {
                    this.checkDentistCount(dentists[i-1], fileName)
                    this.checkDentistOpeningHours(dentists[i-1], fileName)
                    console.log(fileName)
                    publisher.publishTimeSlots(fileName)
                } else {
                    timeSlotCreator.populateAvailability(dentists[i-1])
                }
            } catch(err) {
                console.error(err)
            }
        }
    }
    checkDentistCount(dentists, fileName) {
        fs.readFile (fileName, (err, data) => {
            let existingDentists = JSON.parse(data);
            let difference = dentists.dentists - existingDentists.dentists
            if(difference !== 0) {
                existingDentists.dentists = dentists.dentists;
                for(let i = 0; i<existingDentists.availability.length; i++) {
                    let dateKey = Object.keys(existingDentists.availability[i])[0]
                    for(let j = 0; j< existingDentists.availability[i][dateKey].length; j++) {
                        let timeSlotKey = Object.keys(existingDentists.availability[i][dateKey][j])[0]
                        if(difference < 0){
                            existingDentists.availability[i][dateKey][j][timeSlotKey] -= Math.abs(difference)
                            console.log("It works -")
                        }else {
                            existingDentists.availability[i][dateKey][j][timeSlotKey] += difference
                            console.log("It works +")
                        }
                    }
                }
            }
            fs.writeFileSync(fileName, JSON.stringify(existingDentists));
        })
    }
    checkDentistOpeningHours(dentist, fileName) {
        const timeSlotCreator = new TimeSlotCreator();
        fs.readFile(fileName, (err, data) => {
            let existingDentist = JSON.parse(data);

            for(let day in existingDentist.openinghours) {
                if(dentist.openinghours[day] !== existingDentist.openinghours[day]){
                    let newHours = dentist.openinghours[day]
                    timeSlotCreator.updateTimeslots(existingDentist, day, newHours)
                }
            }
        })

    }
}
module.exports.ChangeController = ChangeController