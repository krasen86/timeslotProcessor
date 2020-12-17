const Variables = require("../config/variables");
const {StorageController} = require("./storageController");

class TimeSlotCreator {
    constructor() {
    }

    createTimeslot(clinic, day) {
        const timeslotArray = []

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
                    timeslotArray.push({
                        "time": startHour + ':' + tempMinute + ' - ' + (startHour) + ':' + (parseInt(tempMinute + 30)),
                        "availableDentists": clinic.dentists
                    })
                   // timeArray.push({[startHour + ':' + tempMinute + ' - ' + (startHour) + ':' + (parseInt(tempMinute+30))]: clinic.dentists})
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
                    timeslotArray.push({
                        "time": tempHour + ':' + tempMinute + ' - ' + endHour + ':' + endMinute,
                        "availableDentists": clinic.dentists
                    })
                    //timeArray.push({[tempHour + ':' + tempMinute + ' - ' + endHour + ':' + endMinute]: clinic.dentists})
                }
            }
        return timeslotArray;

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
            if(day !== 6 && day !== 0) {
                clinic.availability.push({
                    "date": date,
                    "timeslots": this.createTimeslot(clinic, day)
                })
            }
        }
        storageController.saveClinic(clinic)
    }

    updateTimeslots(dentist, day, newHours) {
        const storageController = new StorageController();

        // goes through availability array before any changes are made
        for(let i = 0; i<dentist.availability.length; i++) {
            let date = dentist.availability[i].date;
            let dateObj = Date.parse(date);
            dateObj = new Date(dateObj);

            // make changes when the current availability object (availability[i]) is a weekday of where the opening hours change
            if (dateObj.toLocaleString('en-us', {weekday: 'long'}).toLowerCase() === day) {
                let newTimeslotArray = this.createTimeslot(newHours, dateObj.getDay())
                let oldTimeslotArray = dentist.availability[i].timeslots
                // update the timeslot array of the availability object according to the new opening hours
                dentist.availability[i] = ({
                    "date": date,
                    "timeslots": newTimeslotArray
                })

                // goes through the old timeslot array to update the available dentist to the value before the update
                for(let j = 0; j < oldTimeslotArray.length; j++){
                    let time = oldTimeslotArray[j].time;
                    let newTimeObject = dentist.availability[i].timeslots.find(obj => obj.time === time)

                    // only update the objects that exist in the update version. When opening hours are longer then the old opening hours keep the existing amount of dentist in the clinic.
                    if (newTimeObject !== undefined){
                        newTimeObject.availableDentists = oldTimeslotArray[j].availableDentists
                    }
                }
            }
        }
        dentist.openinghours[day] = newHours.openinghours[day]
        storageController.saveAvailability(dentist, dentist.id)
    }
}
module.exports.TimeSlotCreator = TimeSlotCreator