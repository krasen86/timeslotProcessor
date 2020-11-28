const Variables = require("../config/variables");
const {StorageController} = require("./storageController");

class TimeSlotCreator {
    constructor() {
    }

    createTimeslot(clinic, day) {
        const timeArray = []

        //get openinghours depending on day
        if (day === Variables.MONDAY) {
            var start = clinic.openinghours.monday.split('-')[0]
            var close = clinic.openinghours.monday.split('-')[1]
        }
        if (day === Variables.TUESDAY) {
            var start = clinic.openinghours.tuesday.split('-')[0]
            var close = clinic.openinghours.tuesday.split('-')[1]
        }
        if (day === Variables.WEDNESDAY) {
            var start = clinic.openinghours.wednesday.split('-')[0]
            var close = clinic.openinghours.wednesday.split('-')[1]
        }
        if (day === Variables.THURSDAY) {
            var start = clinic.openinghours.thursday.split('-')[0]
            var close = clinic.openinghours.thursday.split('-')[1]
        }
        if (day === Variables.FRIDAY) {
            var start = clinic.openinghours.friday.split('-')[0]
            var close = clinic.openinghours.friday.split('-')[1]
        }

        //parse hour and minutes for opening

            let startHour = parseInt(start.split(':')[0])
            let startMinute = '00'

        //parse hour for closing to calculate amount of timeslots

            let closeTime = close.split(':')[0]
            let timeSlots = (closeTime-startHour)*2

        //assign temp variables to manipulate within for loop

            let tempHour = startHour
            let tempMinute = startMinute

        //for loop pushes to timearray on first iteration with only adding +30 minutes to endtime of timeslot
        //iterate as many times as there are supposed to be timeslots

            for (var i=0; i<timeSlots; i++){
                if(i === 0) {
                    timeArray.push({[startHour + ':' + tempMinute + ' - ' + (startHour) + ':' + (parseInt(tempMinute+30))]: clinic.dentists})
                } else {
                    tempMinute = parseInt(tempMinute) + 30
        //check if hour needs to be added
                    if (tempMinute === 60) {
                        tempMinute = '00'
                        tempHour += 1
                    }
        //create ending hours and minutes for the timeslots, always 30 minutes
                    var endHour = tempHour
                    var endMinute = parseInt(tempMinute) + 30

                    if (endMinute === 60) {
                        endMinute = '00'
                        endHour += 1
                    }
        //push the timeslot for every iteration to the array, with the amount of dentists the clinic has
                    timeArray.push({[tempHour + ':' + tempMinute + ' - ' + endHour + ':' +endMinute]: clinic.dentists})
                }
            }
        return timeArray;

    }

    populateAvailability(message) {
        const clinic = message
        const storageController = new StorageController()

        clinic.availability = []

        var dateObj = new Date(Date.now())

        for(var j = 0; j<365; j++) {

            var repeatDate = dateObj.setDate(dateObj.getDate() + 1)
            var repeats = new Date(repeatDate)

            var date = repeats.toISOString().split('T')[0]

            var day = repeats.getDay()

            //check if day is saturday or sunday
            if(day != 6 && day != 0) {
                clinic.availability.push({[date]: this.createTimeslot(clinic, day)})
            }
        }
        //console.log(JSON.stringify(clinic,null, " "))
        storageController.saveClinic(clinic)
    }

}
module.exports.TimeSlotCreator = TimeSlotCreator