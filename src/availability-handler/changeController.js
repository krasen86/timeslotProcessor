const fs = require("fs");
const {TimeSlotCreator} = require("./timeSlotCreator");

class ChangeController {
    constructor() {
    }
    checkChange(message) {
        const dentists = JSON.parse(message).dentists
        const timeSlotCreator = new TimeSlotCreator()

        for(var i=1; i<=dentists.length; i++){
            let fileName = './availability-data/availability-' + i +'.json'
            try {
                if (fs.existsSync(fileName)) {
                    console.log(fileName)
                } else {
                    timeSlotCreator.populateAvailability(dentists[i-1])
                }
            } catch(err) {
                console.error(err)
            }
        }

    }
}
module.exports.ChangeController = ChangeController