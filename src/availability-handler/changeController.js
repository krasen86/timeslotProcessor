const fs = require("fs");
const {Watcher} = require("../services/watcher");
const {Publisher} = require("../services/publisher");
const {TimeSlotCreator} = require("./timeSlotCreator");

class ChangeController {
    constructor() {
    }
    checkChange(message) {
        const dentists = JSON.parse(message).dentists
        const timeSlotCreator = new TimeSlotCreator()
        const publisher = new Publisher()
        const watcher = new Watcher()

        for(let i=1; i<=dentists.length; i++){
            let fileName = './availability-data/availability-' + dentists[i-1].id +'.json'
            try {
                if (fs.existsSync(fileName)) {
                    this.checkDentistCount(dentists[i-1], fileName)
                    this.checkDentistOpeningHours(dentists[i-1], fileName)
                    console.log(fileName)
                    publisher.publishTimeSlots(fileName)
                    watcher.watch(fileName)
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
                        }else {
                            existingDentists.availability[i][dateKey][j][timeSlotKey] += difference
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
            let oldDentist = JSON.parse(data);

            for(let day in oldDentist.openinghours) {
                if(dentist.openinghours[day] !== oldDentist.openinghours[day]){
                    timeSlotCreator.updateTimeslots(oldDentist, day, dentist)
                }
            }
        })
    }
}
module.exports.ChangeController = ChangeController